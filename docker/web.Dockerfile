FROM node:20-slim AS builder

WORKDIR /app
COPY apps/web/package*.json apps/web/
WORKDIR /app/apps/web
RUN npm ci
COPY apps/web/
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
