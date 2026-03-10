#!/bin/bash
# Start both backend and frontend servers
# Run from the project root directory

echo "Starting D&D Character Tracker..."
echo ""

# Start backend
echo "Starting FastAPI backend on :8000..."
cd "$(dirname "$0")"
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
echo "Starting Vite frontend on :5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
