# ========================================================================
# Hotel Booking Backend - Dockerfile Production Ready (Azure & Coolify)
# ========================================================================

# Stage 1: Builder (install deps + compile TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

# Amankan cache dengan menyalin package files terlebih dahulu
COPY hotel-booking-backend/package*.json ./hotel-booking-backend/
COPY shared ./shared

# Install dependencies untuk proses build
RUN cd hotel-booking-backend && npm ci

# Salin seluruh source code backend untuk dikompilasi
COPY hotel-booking-backend ./hotel-booking-backend
RUN cd hotel-booking-backend && npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

# Set Node environment ke production
ENV NODE_ENV=production

COPY hotel-booking-backend/package*.json ./hotel-booking-backend/
RUN cd hotel-booking-backend && npm ci --only=production

# Ambil aset hasil compile dari stage builder
COPY --from=builder /app/hotel-booking-backend/dist ./hotel-booking-backend/dist
COPY --from=builder /app/shared ./shared

WORKDIR /app/hotel-booking-backend

# Azure App Service Linux Container membaca PORT secara dinamis dari sistem.
# Kita gunakan port 3000 sebagai default standar container kalian.
ENV PORT=3000
EXPOSE 3000

# Healthcheck yang disesuaikan agar adaptif terhadap port dinamis Azure/Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/hotel-booking-backend/src/index.js"]