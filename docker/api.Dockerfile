FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY apps/api/package*.json ./

# Copy root package-lock.json for workspaces
COPY package-lock.json ./

# Install ALL dependencies (including devDependencies for TypeScript compilation)
RUN npm install

# Copy Prisma schema and migrations
COPY apps/api/prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source and build
COPY apps/api/src ./src/
COPY apps/api/tsconfig.json ./

# Build TypeScript
RUN npx tsc

# Remove devDependencies to reduce image size
RUN npm prune --omit=dev

# Re-install prisma for migrations (needed at runtime)
RUN npm install prisma

# Copy start script
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port
EXPOSE 3001

# Start server with migrations
CMD ["./start.sh"]
