FROM node:lts-alpine

ENV TZ=UTC

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY src ./src

RUN corepack enable
RUN pnpm install

CMD ["node", "/app/src/main.js"]
