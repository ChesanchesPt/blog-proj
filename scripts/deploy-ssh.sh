set -e

REMOTE_HOST="your-server-ip"
REMOTE_USER="your-ssh-user"
REMOTE_PATH="/opt/blog"

# Sync source code (excluding node_modules, dist, etc.)
rsync -avz --delete --exclude 'node_modules' --exclude 'dist' --exclude '.env' \
  ./backend/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/backend/

rsync -avz --delete --exclude 'node_modules' --exclude 'dist' --exclude '.env' \
  ./frontend/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/frontend/

# SSH to install dependencies, build, and run with PM2
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
  set -e
  cd ${REMOTE_PATH}
  
  # Install Node if needed (example for Ubuntu)
  # curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  # sudo apt install -y nodejs

  # Backend
  cd backend
  npm ci
  npm run build
  # Set env variables (use .env file)
  export DATABASE_URL=postgresql://user:pass@localhost:5432/blogdb
  export JWT_SECRET=your_secret
  npx prisma migrate deploy
  pm2 stop blog-backend || true
  pm2 start dist/index.js --name blog-backend

  # Frontend (build static)
  cd ../frontend
  npm ci
  npm run build
  # Copy to nginx served directory (adjust)
  sudo rm -rf /var/www/html/*
  sudo cp -r dist/* /var/www/html/
  sudo systemctl restart nginx

EOF

echo "Deployment complete."