
FROM nginx:alpine
 
# CMD npm run build // LE FAIRE MANUELLEMENT

COPY ./dist/ndakisa/. /usr/share/nginx/html
 