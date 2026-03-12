#!/bin/bash
cd "$(dirname "$0")"

# Start backend
tmux new-session -d -s dnd-backend "python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload" 2>/dev/null
echo "Backend started in tmux session 'dnd-backend'"

# Start frontend
tmux new-session -d -s dnd-frontend "cd frontend && npm run dev" 2>/dev/null
echo "Frontend started in tmux session 'dnd-frontend'"

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "View logs:  tmux attach -t dnd-backend  or  tmux attach -t dnd-frontend"
