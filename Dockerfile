FROM docker.io/oven/bun:1.4-alpine AS base
WORKDIR /app

# Install dependencies into temp directories to cache layers
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Final release image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
