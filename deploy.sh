#!/usr/bin/env bash
set -e

# Simple deploy script for Hostinger VPS using Docker Compose
# Usage: Copy .env.production (from .env.production.example), then run ./deploy.sh

# Ensure .env exists
if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.production.example to .env and set secrets before running this script."
  exit 1
fi

# Build and start containers
docker-compose pull || true
docker-compose build --no-cache backend
docker-compose up -d --remove-orphans

echo "Containers started. Run database migrations inside the backend container when ready:"
echo "  docker-compose exec backend npx prisma migrate deploy"

# Optional: run seeds if you have a seed script
echo "If you have a seed script, run: docker-compose exec backend node prisma/seed.js (or appropriate seed command)"

echo "Deployment finished. Visit your domain to check the site. Obtain TLS certificates (Let's Encrypt) on the host or integrate certbot as desired."
