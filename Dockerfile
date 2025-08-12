FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:stable-alpine AS production
RUN apk add --no-cache bash

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/browser /usr/share/nginx/html

COPY set-env.sh /usr/share/nginx/html/
RUN chmod +x /usr/share/nginx/html/set-env.sh

WORKDIR /usr/share/nginx/html

EXPOSE 4200

CMD ["/bin/bash", "-c", "nginx -g 'daemon off;'"]