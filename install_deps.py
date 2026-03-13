import subprocess
import sys

packages = [
    "fastapi",
    "uvicorn[standard]",
    "sqlalchemy",
    "python-multipart",
    "aiofiles",
]

subprocess.check_call(
    [sys.executable, "-m", "pip", "install"] + packages,
    stdout=sys.stdout,
    stderr=sys.stderr,
)
print("All backend dependencies installed.")
