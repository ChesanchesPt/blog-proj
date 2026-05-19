set -e

# Build backend image
echo "Building backend image..."
docker build -t blog-backend:latest ./backend

# Build frontend image
echo "Building frontend image..."
docker build -t blog-frontend:latest ./frontend

echo "Images built successfully."