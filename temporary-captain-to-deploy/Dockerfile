# Stage 1: Build the VitePress application
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run docs:build # Or whatever your build command is

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/.vitepress/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]