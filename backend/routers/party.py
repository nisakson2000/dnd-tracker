"""
Party Connect — LAN WebSocket hub
Each "room" is identified by a 4-digit code. The host (whoever created it)
owns the room. Any client on the same LAN can join by entering the code.

Message protocol (JSON):
  Client → Server:
    { type: "join",   room: "1234", character: { id, name, race, class, level, hp, max_hp, ac } }
    { type: "update", room: "1234", character: { ...same shape... } }
    { type: "ping",   room: "1234" }

  Server → Client:
    { type: "welcome",              members: [...], you: <client_id> }
    { type: "player_joined",        member: { client_id, character } }
    { type: "updated",              member: { client_id, character } }
    { type: "player_disconnected",  client_id: "..." }
    { type: "error",                message: "..." }
    { type: "pong" }
"""

import json
import time
import uuid
import asyncio
import logging
from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.bug_reporter import next_report_id

logger = logging.getLogger(__name__)
router = APIRouter(tags=["party"])

MAX_MESSAGE_SIZE = 65536  # 64KB per message
CLIENT_TIMEOUT_SECS = 90  # Remove clients with no activity after 90s
CLEANUP_INTERVAL_SECS = 30

# room_code -> { client_id -> {"ws": WebSocket, "character": dict, "last_seen": float} }
_rooms: dict[str, dict[str, dict]] = defaultdict(dict)
# client_id -> room_code  (reverse lookup for cleanup)
_client_room: dict[str, str] = {}
# Track if zombie cleanup task is running
_cleanup_task: asyncio.Task | None = None
# Lock for room dictionary mutations
_room_lock = asyncio.Lock()


async def _make_room_code() -> str:
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    for _ in range(100):
        code = "".join(__import__("random").choices(chars, k=4))
        if code not in _rooms:
            return code
    raise RuntimeError("Could not generate unique room code")


def _make_client_id() -> str:
    return uuid.uuid4().hex[:12]


async def _broadcast(room_code: str, message: dict, exclude: str | None = None):
    dead = []
    for cid, conn in list(_rooms.get(room_code, {}).items()):
        if cid == exclude:
            continue
        try:
            await conn["ws"].send_text(json.dumps(message))
        except Exception:
            dead.append(cid)
    for cid in dead:
        await _disconnect_client(cid)


async def _disconnect_client(client_id: str):
    async with _room_lock:
        room_code = _client_room.pop(client_id, None)
        if not room_code:
            return
        _rooms[room_code].pop(client_id, None)
        if not _rooms[room_code]:
            del _rooms[room_code]
            return
    await _broadcast(room_code, {"type": "player_disconnected", "client_id": client_id})


async def _zombie_cleanup_loop():
    """Periodically remove clients that haven't sent any message in CLIENT_TIMEOUT_SECS."""
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECS)
        now = time.monotonic()
        async with _room_lock:
            stale = []
            for room_code, members in list(_rooms.items()):
                for cid, conn in list(members.items()):
                    if now - conn.get("last_seen", now) > CLIENT_TIMEOUT_SECS:
                        stale.append(cid)
        for cid in stale:
            logger.info("Removing zombie client: %s", cid)
            await _disconnect_client(cid)


def _ensure_cleanup_task():
    global _cleanup_task
    if _cleanup_task is None or _cleanup_task.done():
        _cleanup_task = asyncio.ensure_future(_zombie_cleanup_loop())


@router.get("/party/rooms")
async def list_rooms():
    async with _room_lock:
        return {code: {"members": len(members)} for code, members in _rooms.items()}


@router.post("/party/rooms")
async def create_room():
    async with _room_lock:
        code = await _make_room_code()
        _rooms[code]  # create empty dict via defaultdict
    return {"room_code": code}


@router.websocket("/party/ws")
async def party_ws(ws: WebSocket):
    await ws.accept()
    _ensure_cleanup_task()
    client_id = _make_client_id()
    room_code: str | None = None

    try:
        while True:
            raw = await ws.receive_text()

            # Message size limit
            if len(raw) > MAX_MESSAGE_SIZE:
                await ws.send_text(json.dumps({"type": "error", "message": "Message too large"}))
                continue

            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await ws.send_text(json.dumps({"type": "error", "message": "Invalid JSON"}))
                continue

            msg_type = msg.get("type")
            code = msg.get("room", "").strip().upper()

            if msg_type == "join":
                character = msg.get("character", {})
                if not code:
                    await ws.send_text(json.dumps({"type": "error", "message": "Room code required"}))
                    continue
                async with _room_lock:
                    if code not in _rooms:
                        await ws.send_text(json.dumps({"type": "error", "message": "Room not found"}))
                        continue
                    if room_code and room_code != code:
                        pass  # will disconnect below outside lock
                if room_code and room_code != code:
                    await _disconnect_client(client_id)
                room_code = code
                async with _room_lock:
                    _rooms[room_code][client_id] = {
                        "ws": ws, "character": character, "last_seen": time.monotonic(),
                    }
                    _client_room[client_id] = room_code
                    members = [
                        {"client_id": cid, "character": conn["character"]}
                        for cid, conn in _rooms[room_code].items()
                    ]
                await ws.send_text(json.dumps({"type": "welcome", "you": client_id, "members": members}))
                await _broadcast(room_code, {
                    "type": "player_joined",
                    "member": {"client_id": client_id, "character": character},
                }, exclude=client_id)

            elif msg_type == "update":
                async with _room_lock:
                    if not room_code or client_id not in _rooms.get(room_code, {}):
                        await ws.send_text(json.dumps({"type": "error", "message": "Not in a room"}))
                        continue
                    character = msg.get("character", {})
                    _rooms[room_code][client_id]["character"] = character
                    _rooms[room_code][client_id]["last_seen"] = time.monotonic()
                await _broadcast(room_code, {
                    "type": "updated",
                    "member": {"client_id": client_id, "character": character},
                }, exclude=client_id)

            elif msg_type == "bug_report":
                # Broadcast bug reports to ALL clients so dev builds can capture them
                async with _room_lock:
                    in_room = room_code and client_id in _rooms.get(room_code, {})
                    if in_room:
                        _rooms[room_code][client_id]["last_seen"] = time.monotonic()
                        reporter = _rooms[room_code][client_id].get("character", {}).get("name", "Unknown")
                if in_room:
                    report_id = next_report_id()
                    report_data = msg.get("report", {})
                    summary = report_data.get("description", str(report_data))[:120] if isinstance(report_data, dict) else str(report_data)[:120]
                    logger.info(
                        "[BugReporter] Bug report %s from %s (client=%s, room=%s): %s",
                        report_id, reporter, client_id, room_code, summary,
                    )
                    await _broadcast(room_code, {
                        "type": "bug_report",
                        "client_id": client_id,
                        "reporter": reporter,
                        "report_id": report_id,
                        "report": report_data,
                    })  # No exclude — send to everyone including sender

            elif msg_type == "ping":
                async with _room_lock:
                    if room_code and client_id in _rooms.get(room_code, {}):
                        _rooms[room_code][client_id]["last_seen"] = time.monotonic()
                await ws.send_text(json.dumps({"type": "pong"}))

            else:
                await ws.send_text(json.dumps({"type": "error", "message": f"Unknown type: {msg_type}"}))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.exception("Party WS error: %s", e)
    finally:
        await _disconnect_client(client_id)
