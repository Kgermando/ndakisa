FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:latest
RUN mkdir /app
COPY --from=build-stage /app/dist/my-app/ /app
COPY nginx.conf /etc/nginx/nginx.conf
USER nginx


# FROM node:19.5.0-alpine3.17 AS builder


# WORKDIR /usr/src/app


# COPY package*.json ./


# RUN npm install


# COPY . .


# RUN npm run build --prod


# FROM nginx:1.19-alpine


# RUN rm -rf /usr/share/nginx/html/*


# COPY --from=builder /usr/src/app/dist/ndakisa /usr/share/nginx/html


# COPY nginx.conf /etc/nginx/nginx.conf


# EXPOSE 80
# EXPOSE 443
