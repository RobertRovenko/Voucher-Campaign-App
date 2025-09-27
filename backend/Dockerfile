# Use Node 18
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port and set default command
EXPOSE 4000 5555
CMD ["npm", "run", "dev"]
