# Tahap build
FROM node:18-alpine AS builder
WORKDIR /app

# Salin file dependency dulu biar cache bisa dipakai maksimal
COPY package*.json ./

RUN npm install

# Baru salin sisa file proyek
COPY . .

RUN npm run build

# Tahap produksi
FROM node:18-alpine

# Install serve hanya (tanpa npm install full)
RUN npm install -g serve

WORKDIR /app

# Salin hanya hasil build dari tahap builder
COPY --from=builder /app/dist ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
