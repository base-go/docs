# Multi-stage build for VitePress documentation
FROM oven/bun:1.2-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the documentation (includes OG image generation)
RUN bun run docs:build

# Final stage - serve with nginx
FROM nginx:alpine

# Install additional tools for better performance
RUN apk add --no-cache tzdata

# Copy built files to nginx html directory
COPY --from=build-stage /app/.vitepress/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true

# Set timezone (optional)
ENV TZ=UTC

# Create directory for OG images (if not created during build)
RUN mkdir -p /usr/share/nginx/html/og

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

# Use nginx with proper signal handling
CMD ["nginx", "-g", "daemon off;"]