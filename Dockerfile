
FROM nginx:alpine

COPY ./dist/ndakisa/. /usr/share/nginx/html
 