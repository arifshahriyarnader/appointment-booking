# Use Node.js to build the React app
FROM node:20.17-slim AS build

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire client app
COPY . .

# Pass environment variables as build arguments
ARG VITE_BASE_URL
ARG VITE_CURRENT_USER_KEY

# Set these variables in the build process
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_CURRENT_USER_KEY=${VITE_CURRENT_USER_KEY}

# Build the React app
RUN npm run build

# Use Nginx for serving the built app
FROM nginx:latest AS production

# Copy the built React app to Nginx's static files directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
