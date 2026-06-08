# Stage 1: Build aplikasi React + Vite
FROM node:20-alpine AS build
WORKDIR /app

# Salin package.json dan pasang dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh kode modul frontend dan lakukan build
COPY . .
RUN npm run build

# Stage 2: Serve menggunakan Nginx yang ringan untuk Production
FROM nginx:stable-alpine
# Vite secara default mengeluarkan hasil build di folder /dist
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspos port 80 untuk lalu lintas web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]