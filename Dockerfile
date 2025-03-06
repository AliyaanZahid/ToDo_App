# Use an official node.js runtime as a parent image
FROM node:22-alpine

#Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files into the container at /app
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the Prisma schema and migrations
COPY ./prisma ./prisma

# Run Prisma Migrate before generating Prisma Client
RUN npx prisma migrate deploy

# Generate Prisma client
RUN npx prisma generate  # Add this line to ensure Prisma Client is generated


# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port the app runs in
EXPOSE 5003

# Define the command to run the application
CMD ["node", "src/server.js"]


