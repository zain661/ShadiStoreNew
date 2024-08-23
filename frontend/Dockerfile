FROM node:18.20.4-bullseye as build

WORKDIR /app

COPY . .

RUN npm install && \
  npm run build

ENTRYPOINT npm run start
