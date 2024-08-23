FROM node:18.20.4-bullseye as build

WORKDIR /app

COPY . .

RUN npm install && \
  npm run build


FROM node:18.20.4-bullseye

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

ENTRYPOINT npm run dev
