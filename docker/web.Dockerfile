FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy source and build
COPY apps/web/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
