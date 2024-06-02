FROM node:lts-alpine

ENV TZ=UTC

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable
RUN pnpm install

COPY src ./src

CMD ["node", "/app/src/main.js"]
