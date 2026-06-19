FROM node:18-alpine

WORKDIR /app

# Copy package dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
