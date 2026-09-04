FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package*.json ./
RUN npm ci --production

# Copy application source
COPY backend/ .

# Generate Prisma client if schema present (no-op if not)
RUN if [ -d "./prisma" ]; then npx prisma generate || true; fi

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
