# Use Node.js 16.x LTS
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of the application code
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
