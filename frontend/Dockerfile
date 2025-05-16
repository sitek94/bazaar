# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# --- Nginx Stage ---
FROM nginx:alpine AS release
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
# If you want to copy static assets (optional)
COPY --from=builder /app/public ./ 
# If you have a custom nginx.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]