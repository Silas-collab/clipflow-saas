FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY apps/api/package*.json ./
RUN npm ci --only=production

# Copy Prisma schema
COPY apps/api/prisma ./prisma/
RUN npx prisma generate

# Copy source
COPY apps/api/dist ./dist/

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/server.js"]
