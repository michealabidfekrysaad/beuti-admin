# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12.6.0 as build-admin
WORKDIR /app
COPY package.json /app/
RUN npm install

COPY ./ /app/
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=build-admin /app/build/ /usr/share/nginx/html
