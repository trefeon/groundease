FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --workspace @ruang-pulih/api

COPY apps/api apps/api
RUN npm run build --workspace @ruang-pulih/api

EXPOSE 5000

CMD ["node", "apps/api/dist/server.js"]
