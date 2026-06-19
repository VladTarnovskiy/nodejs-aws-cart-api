# syntax=docker/dockerfile:1

# --- Build stage: install deps and compile TypeScript ---
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first so this layer is cached when only source files change
COPY package.json package-lock.json ./

RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN npm run build \
  && npm prune --omit=dev \
  && npm cache clean --force

# --- Production stage: minimal runtime image ---
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 4000

CMD ["node", "dist/main"]
