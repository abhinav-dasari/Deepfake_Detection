# 1. Use official Node.js Alpine image (lightweight)
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (leverages Docker layer caching)
COPY package*.json .

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project
COPY . .

# 6. Expose port 5173 (Vite default)
EXPOSE 5173

# 7. Start Vite dev server with --host to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
