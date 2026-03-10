#!/bin/bash
cd /home/nisakson/dnd-tracker

# Create Vite React project in temp dir, then merge with existing frontend dir
npx --yes create-vite@latest frontend-temp --template react

# Copy generated files into existing frontend dir (preserving our audio file)
cp frontend-temp/package.json frontend/package.json
cp frontend-temp/vite.config.js frontend/vite.config.js
cp frontend-temp/index.html frontend/index.html
cp frontend-temp/eslint.config.js frontend/eslint.config.js 2>/dev/null
cp -r frontend-temp/src frontend/src
rm -rf frontend-temp

# Install deps
cd frontend
npm install
npm install react-router-dom axios react-hot-toast lucide-react framer-motion @uiw/react-md-editor tailwindcss @tailwindcss/vite

echo "Frontend setup complete!"
