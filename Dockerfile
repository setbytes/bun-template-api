FROM oven/bun:1 as base

# Set the working directory
WORKDIR /usr/src/app

# Switch to root user temporarily for system updates
USER root

# Install required packages
RUN apt-get update && apt-get install -y curl

# Copy package files and install dependencies
COPY package*.json ./
RUN /bin/sh -c bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Change ownership to the 'bun' user
RUN chown -R bun:bun /usr/src/app

# Switch back to the 'bun' user
USER bun

# Expose the necessary port
EXPOSE 8090/tcp

# Define the entry point for running the application
ENTRYPOINT ["bun", "run", "src/app/index.ts"]
