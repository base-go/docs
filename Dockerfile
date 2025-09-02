# Multi-stage build for VitePress documentation
FROM oven/bun:1.2-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the documentation
RUN bun run docs:build

# Final stage - just copy built files
FROM alpine:latest
WORKDIR /app
COPY --from=build-stage /app/.vitepress/dist ./dist
EXPOSE 4173
CMD ["bun", "run", "docs:preview", "--host", "0.0.0.0", "--port", "4173"]
