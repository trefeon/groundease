# Build stage
FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace @ruang-pulih/web

COPY apps/web apps/web
COPY apps/web/nginx.conf apps/web/nginx.conf
RUN npm run build --workspace @ruang-pulih/web

# Production stage
FROM nginx:alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY --from=build /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
