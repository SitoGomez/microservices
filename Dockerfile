# Stage 1: Builder
FROM node:22-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Install dependencies using pnpm
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm build

# Stage 2: Runtime
FROM node:22-alpine

# Install pnpm globally in runtime too (optional for debugging or monorepo usage)
RUN npm install -g pnpm

WORKDIR /app

# Copy compiled app and dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3001

# Run the application
CMD ["node", "dist/app/main"]