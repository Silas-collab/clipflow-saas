FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY apps/api/package*.json ./

# Copy root package-lock.json for workspaces
COPY package-lock.json ./

# Install dependencies (use npm install instead of ci)
RUN npm install --omit=dev

# Copy Prisma schema
COPY apps/api/prisma ./prisma/
RUN npx prisma generate

# Copy source and build
COPY apps/api/src ./src/
COPY apps/api/tsconfig.json ./
RUN npm install -g typescript && npx tsc

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/index.js"]
