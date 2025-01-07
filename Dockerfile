FROM oven/bun:latest
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install && apt update && apt install -y dnsutils
COPY . .
EXPOSE 3000
ENTRYPOINT ["bun", "index.tsx"]
