FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Optional build-time settings. Leave VITE_CV_API_URL empty to use same-origin /api/cv,
# which nginx proxies to API_UPSTREAM (recommended, no CORS needed).
ARG VITE_CV_API_URL=""
ARG VITE_APP_VERSION=""
ENV VITE_CV_API_URL=$VITE_CV_API_URL \
    VITE_APP_VERSION=$VITE_APP_VERSION

RUN npm run build

FROM nginx:alpine

# API_UPSTREAM: where /api is proxied. Override at runtime for other environments,
# e.g. -e API_UPSTREAM=https://zealous-bay-03ae5da0f.4.azurestaticapps.net
# NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1 makes the entrypoint export NGINX_LOCAL_RESOLVERS
# from /etc/resolv.conf (Docker: 127.0.0.11), used by the resolver in the template.
ENV API_UPSTREAM=http://api:80 \
    NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
