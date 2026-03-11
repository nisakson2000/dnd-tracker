"""
Update endpoints — version check and git-pull self-update.
"""
import os
import subprocess
import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)
router = APIRouter()

_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_VERSION_FILE = os.path.join(_ROOT, "VERSION")


def _read_version() -> str:
    try:
        with open(_VERSION_FILE, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "0.0.0"


@router.get("/version")
def get_version():
    """Return the current installed version."""
    return {"version": _read_version()}


@router.post("/update")
def apply_update():
    """
    Pull latest code from git and restart the backend process.
    Only works when running from a git repo (not a frozen EXE).
    """
    try:
        result = subprocess.run(
            ["git", "pull", "--ff-only"],
            cwd=_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            logger.error("git pull failed: %s", result.stderr)
            return JSONResponse(
                {"success": False, "error": result.stderr or "git pull failed"},
                status_code=500,
            )

        logger.info("git pull output: %s", result.stdout)

        # Restart the current process via uvicorn's --reload trigger (touch main.py)
        try:
            main_py = os.path.join(_ROOT, "backend", "main.py")
            os.utime(main_py, None)  # triggers --reload watcher
        except Exception as e:
            logger.warning("Could not trigger reload: %s", e)

        return {"success": True, "output": result.stdout.strip()}

    except subprocess.TimeoutExpired:
        return JSONResponse({"success": False, "error": "git pull timed out"}, status_code=500)
    except FileNotFoundError:
        return JSONResponse(
            {"success": False, "error": "git not found — is git installed?"},
            status_code=500,
        )
    except Exception as e:
        logger.exception("Update failed")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)
