Deployment and host requirements

This repository has been prepared for Docker-based deployment on a Hostinger VPS. The following files were added:

- backend/Dockerfile — production Docker image for the Node backend
- docker-compose.yml — services: db (MySQL), backend (API), nginx (static files + proxy)
- nginx/conf.d/job-shield.conf — nginx config; replace YOUR_DOMAIN with your domain
- .env.production.example — example environment variables for production
- deploy.sh — helper script to build and bring up the stack

What I still need from you

1) VPS access or you run commands: I cannot access your Hostinger VPS directly without SSH credentials. Provide either:
   - SSH access (IP, username, SSH key or password) so I can deploy for you, OR
   - You run the deployment commands yourself — I will provide exact commands below.

2) Domain name and DNS: the nginx config still uses 'YOUR_DOMAIN'. Give the domain name and ensure an A record points to the VPS IP.

3) Secrets: create a production .env file on the VPS based on .env.production.example and set secure values for:
   - MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD
   - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
   - CORS_ORIGIN (set to https://your-domain.com)

4) TLS/HTTPS: obtain certificates using certbot or configure Hostinger TLS. I left certs volume for Let's Encrypt if you run certbot on the host.

Production deployment steps (run on your Hostinger VPS)

1) Install Docker and Docker Compose (if not already installed):
   - curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   - sudo apt-get install -y docker-compose-plugin

2) Clone the repo and cd into it:
   - git clone https://github.com/sharmachikki/Job-Shield.git
   - cd Job-Shield

3) Copy example env and edit with your secrets:
   - cp .env.production.example .env
   - Edit .env and set strong passwords and secrets

4) Build & start the stack:
   - chmod +x deploy.sh
   - ./deploy.sh

5) Run database migrations (Prisma):
   - docker-compose exec backend npx prisma migrate deploy
   - If you prefer to run migrations locally before starting, run the appropriate prisma commands on the host or container.

6) (Optional) Obtain TLS certs using certbot and configure nginx to use /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem and privkey.pem.

Post-deploy checklist

- Confirm nginx is serving static files and proxying /api to backend
- Check backend logs: docker-compose logs -f backend
- Create an admin account or seed data if needed
- Configure periodic backups for MySQL and uploaded files

Next steps I can take for you (pick any):
- I can create a simple seed script (prisma/seed.js) and add it to the repo so the DB is seeded with sample users/jobs.
- I can add a PM2 ecosystem file instead of Docker if you prefer systemd/PM2 deployment.
- I can run the deployment on your VPS if you provide SSH access (I will give instructions for secure credential sharing).

Would you like me to:
A) Add a seed script and run migrations/seeding via a commit, or
B) Proceed to deploy on your VPS if you provide SSH access, or
C) Just generate the remaining deployment commands and let you run them?
