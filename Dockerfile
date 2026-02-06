FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install --production

# Copy application code
COPY . .

# Start the server
EXPOSE 3000
CMD ["bun", "run", "index.ts"]
