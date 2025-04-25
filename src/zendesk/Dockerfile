FROM python:3.12-slim AS base

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Install Python dependencies
RUN pip install -e .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run the server
ENTRYPOINT ["node", "dist/index.js"]
