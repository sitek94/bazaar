# Stage 1: Build stage
FROM oven/bun:1.2.13-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

ARG API_HOST 
ENV VITE_API_HOST=${API_HOST}

RUN bun run build

# Stage 2: Nginx Stage (uses non-root user by default)
FROM nginx:1.28.0-alpine AS release
WORKDIR /usr/share/nginx/html

# Copy built assets and config
COPY --from=builder /app/dist ./
COPY --from=builder /app/public ./ 
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]