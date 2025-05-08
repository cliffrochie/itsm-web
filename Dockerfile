# Stage 1: Build the Vite React app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the Vite build output (in dist/)
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3500

CMD ["nginx", "-g", "daemon off;"]