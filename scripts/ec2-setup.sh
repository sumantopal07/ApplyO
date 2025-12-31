#!/bin/bash

# ApplyO EC2 Setup Script
# Run this on a fresh Ubuntu EC2 instance

set -e

echo "=========================================="
echo "ApplyO EC2 Setup Script"
echo "=========================================="

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Add swap space (2GB) for t2.micro instances
echo "Setting up swap space..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap space created!"
else
    echo "Swap already exists, skipping..."
fi

# Install Docker
echo "Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Install Git
echo "Installing Git..."
sudo apt install -y git

# Create app directory
echo "Creating app directory..."
sudo mkdir -p /opt/applyo
sudo chown $USER:$USER /opt/applyo

echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in (for docker group)"
echo "2. cd /opt/applyo"
echo "3. git clone https://github.com/sumantopal07/ApplyO.git ."
echo "4. cp .env.example .env"
echo "5. Edit .env with your MongoDB password"
echo "6. docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
