# Stage 1: Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
# Using npm ci for reproducible builds, and --omit=dev to exclude devDependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Add any build steps here if necessary (e.g., TypeScript compilation)

# Stage 2: Production stage
FROM node:18-alpine
WORKDIR /usr/src/app

# Create a non-root user and group for security purposes
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed dependencies and application code from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/. ./

# Ensure the appuser owns the application files
RUN chown -R appuser:appgroup /usr/src/app

# Switch to the non-root user
USER appuser

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the application
CMD ["node", "server.js"]