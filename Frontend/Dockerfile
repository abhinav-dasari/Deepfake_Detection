# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first (leverages Docker layer caching)
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Accept VITE_API_URL at build time (Render passes env vars as build args)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build for production (Vite bakes VITE_API_URL into the JS bundle here)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (SPA support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
