"""Install Python backend dependencies (legacy — Tauri/Rust is the primary backend)."""

import subprocess
import sys

packages = [
    "fastapi",
    "uvicorn[standard]",
    "sqlalchemy",
    "pydantic",
    "python-multipart",
    "aiofiles",
]

subprocess.check_call(
    [sys.executable, "-m", "pip", "install"] + packages,
    stdout=sys.stdout,
    stderr=sys.stderr,
)
print("All backend dependencies installed.")
