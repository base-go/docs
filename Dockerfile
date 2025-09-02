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

# Final stage - keep bun runtime for preview server
FROM oven/bun:1.2-alpine
WORKDIR /app

# Copy built files and necessary package files
COPY --from=build-stage /app/.vitepress/dist ./dist
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/.vitepress ./.vitepress

# Install only production dependencies (if preview command needs them)
RUN bun install --production

EXPOSE 4173
CMD ["bun", "run", "docs:preview", "--host", "0.0.0.0", "--port", "4173"]