# Use the official Node.js LTS image as base
FROM node:20-bullseye

# Install additional system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    ca-certificates \
    gnupg \
    build-essential \
    python3 \
    python3-pip \
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages useful for development
RUN npm install -g \
    npm@latest \
    typescript \
    eslint

# Create a non-root user 'node' (already exists in node image)
# Set up the workspace directory
WORKDIR /workspace

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Expose the Next.js development port
EXPOSE 3000

# Set the default user
USER node

# Default command
CMD ["bash"]
