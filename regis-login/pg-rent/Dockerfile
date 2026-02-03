# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Create a default nginx.conf if one doesn't exist in the project, 
# but usually it's better to supply a custom one for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
