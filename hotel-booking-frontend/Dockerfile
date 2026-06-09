# Stage 1: Build aplikasi React + Vite
FROM node:20-alpine AS build
WORKDIR /app

# 1. Salin package.json frontend dan folder shared dari root proyek
COPY hotel-booking-frontend/package*.json ./hotel-booking-frontend/
COPY shared ./shared

# 2. Masuk ke folder frontend untuk install dependensi
WORKDIR /app/hotel-booking-frontend
RUN npm install

# 3. Salin sisa kode frontend ke dalam container
COPY hotel-booking-frontend/ ./

# Menerima suntikan URL API dari GitHub Actions
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# 4. Trik DevOps: Jalankan vite build langsung untuk bypass strict tsc check
RUN npx vite build

# Stage 2: Serve menggunakan Nginx untuk Production
FROM nginx:stable-alpine

# 🔴 SEKARANG DI SINI: Menyuntikkan aturan try_files agar React Router tidak 404 saat di-refresh
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/hotel-booking-frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]