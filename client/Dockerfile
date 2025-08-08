# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Enable Corepack and activate pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

# Install deps based on lockfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build your app
COPY . .
RUN pnpm run build


# Stage 2: runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Enable Corepack & pnpm in runtime too
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000
CMD ["pnpm", "start"]