# Stage 0: Base image - using user's pinned version
FROM oven/bun:1.2.13-alpine AS base
WORKDIR /usr/src/app

# Stage 1: Install production dependencies into a temporary directory
# This leverages Docker cache for dependencies and keeps the final image clean.
FROM base AS install
WORKDIR /temp/prod
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 2: Application source builder
# This stage will hold the application source code.
FROM base AS app-source-builder
# WORKDIR is /usr/src/app (inherited from base)
COPY . .

# Stage 3: Final release image - using user's pinned alpine version
FROM oven/bun:1.2.13-alpine AS release
WORKDIR /usr/src/app

# Create non-root user and group (user's naming)
RUN addgroup -S app_group && adduser -S app_user -G app_group

# Copy production dependencies from the 'install' stage
COPY --from=install /temp/prod/node_modules ./node_modules

# Copy application files from the 'app-source-builder' stage.
# This copies server.js, package.json, bun.lockb, and any other project files.
COPY --from=app-source-builder /usr/src/app/. ./

# Ensure the app_user owns the application files
RUN chown -R app_user:app_group /usr/src/app

# Switch to the non-root user (user's naming)
USER app_user

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

CMD ["bun", "src/server.ts"]