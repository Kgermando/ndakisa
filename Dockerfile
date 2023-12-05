FROM node:18-alpine AS builder
 
WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build



FROM nginx:alpine

COPY ./dist/ndakisa/. /usr/share/nginx/html
