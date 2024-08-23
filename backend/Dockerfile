FROM node:18.20.4-bullseye as build

WORKDIR /app

COPY . .

RUN npm install

ENTRYPOINT npm run start
