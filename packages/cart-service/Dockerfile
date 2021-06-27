FROM node:lts as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build && npm prune --production



FROM alpine:latest
RUN apk add --update --no-cache nodejs
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "main.js"]
