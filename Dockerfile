FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:stable-alpine AS production
RUN apk add --no-cache bash

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/portal-de-midia-front-end/browser /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 4200

CMD ["/bin/bash", "-c", "nginx -g 'daemon off;'"]