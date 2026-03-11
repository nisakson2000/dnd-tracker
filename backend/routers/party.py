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
    { type: "welcome",  members: [...], you: <client_id> }
    { type: "player_joined",       member: { client_id, character } }
    { type: "updated",              member: { client_id, character } }
    { type: "player_disconnected",  client_id: "..." }
    { type: "error",    message: "..." }
    { type: "pong" }
"""

import json
import random
import string
import logging
from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)
router = APIRouter(tags=["party"])

# room_code -> { client_id -> {"ws": WebSocket, "character": dict} }
_rooms: dict[str, dict[str, dict]] = defaultdict(dict)
# client_id -> room_code  (reverse lookup for cleanup)
_client_room: dict[str, str] = {}


def _make_room_code() -> str:
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    while True:
        code = "".join(random.choices(chars, k=4))
        if code not in _rooms:
            return code


def _make_client_id() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=8))


async def _broadcast(room_code: str, message: dict, exclude: str | None = None):
    dead = []
    for cid, conn in list(_rooms[room_code].items()):
        if cid == exclude:
            continue
        try:
            await conn["ws"].send_text(json.dumps(message))
        except Exception:
            dead.append(cid)
    for cid in dead:
        await _disconnect_client(cid)


async def _disconnect_client(client_id: str):
    room_code = _client_room.pop(client_id, None)
    if not room_code:
        return
    _rooms[room_code].pop(client_id, None)
    if not _rooms[room_code]:
        del _rooms[room_code]
    else:
        await _broadcast(room_code, {"type": "player_disconnected", "client_id": client_id})


@router.get("/party/rooms")
def list_rooms():
    return {code: {"members": len(members)} for code, members in _rooms.items()}


@router.post("/party/rooms")
def create_room():
    code = _make_room_code()
    _rooms[code]  # create empty dict
    return {"room_code": code}


@router.websocket("/party/ws")
async def party_ws(ws: WebSocket):
    await ws.accept()
    client_id = _make_client_id()
    room_code: str | None = None

    try:
        while True:
            raw = await ws.receive_text()
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
                if room_code and room_code != code:
                    await _disconnect_client(client_id)
                room_code = code
                _rooms[room_code][client_id] = {"ws": ws, "character": character}
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
                if not room_code or client_id not in _rooms.get(room_code, {}):
                    await ws.send_text(json.dumps({"type": "error", "message": "Not in a room"}))
                    continue
                character = msg.get("character", {})
                _rooms[room_code][client_id]["character"] = character
                await _broadcast(room_code, {
                    "type": "updated",
                    "member": {"client_id": client_id, "character": character},
                }, exclude=client_id)

            elif msg_type == "ping":
                await ws.send_text(json.dumps({"type": "pong"}))

            else:
                await ws.send_text(json.dumps({"type": "error", "message": f"Unknown type: {msg_type}"}))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.exception("Party WS error: %s", e)
    finally:
        await _disconnect_client(client_id)
