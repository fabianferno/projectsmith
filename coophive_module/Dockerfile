FROM node:20-slim

WORKDIR /app

COPY entrypoint.js package.json ./

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "entrypoint.js"]
