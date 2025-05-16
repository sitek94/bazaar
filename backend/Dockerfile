# Stage 1: Build stage
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Copy package.json and install dependencies
# Using npm ci for reproducible builds, and --omit=dev to exclude devDependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Add any build steps here if necessary (e.g., TypeScript compilation)

# Stage 2: Production stage
FROM node:22-alpine
WORKDIR /usr/src/app

# Create a new non-root user
RUN addgroup -S app_group 
RUN adduser -S app_user -G app_group

# Copy installed dependencies and application code from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/. ./

# Ensure the app_user owns the application files
RUN chown -R app_user:app_group /usr/src/app

# Switch to the non-root user
USER app_user

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the application
CMD ["node", "server.js"]