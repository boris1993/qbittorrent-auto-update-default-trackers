FROM node:20-alpine

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY src ./src

RUN corepack enable
RUN pnpm install

CMD ["node", "/app/src/main.js"]
