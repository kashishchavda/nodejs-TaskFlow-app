# ============================================
# Multi-stage Docker Build for Node.js App
# ============================================

# Stage 1: Base Image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ============================================
# Stage 2: Production Image
FROM node:18-alpine AS production

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Create app directory
WORKDIR /app

# Copy dependencies from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy application files
COPY server.js ./
COPY public ./public
COPY package*.json ./

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

#Health check
HEALTHCHECK CMD curl --fail http://localhost:3000/api/health || exit 1


# Start the application
CMD ["node", "server.js"]
