# Build and serve VitePress with bun
FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the documentation
RUN bun run docs:build

# Expose port
EXPOSE 4173

# Start the preview server
CMD ["bun", "run", "docs:preview", "--host", "0.0.0.0", "--port", "4173"]