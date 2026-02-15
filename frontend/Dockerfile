# Use a Node.js base image for building the frontend
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite/React application
RUN npm run build

# Use a lightweight Nginx image to serve the built frontend
FROM nginx:alpine

# Copy the Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend static files to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
