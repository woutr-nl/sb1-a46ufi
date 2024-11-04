#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_NAME="padelweer"
APP_PATH="/var/www/$APP_NAME"
NODE_VERSION="18"
DOMAIN=""
EMAIL=""

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_message "Please run as root" "$RED"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., padelweer.com): " DOMAIN
read -p "Enter email for SSL certificate: " EMAIL

# Update system
print_message "Updating system..." "$YELLOW"
apt update && apt upgrade -y

# Install required packages
print_message "Installing required packages..." "$YELLOW"
apt install -y curl git nginx certbot python3-certbot-nginx sqlite3 build-essential

# Install Node.js
print_message "Installing Node.js..." "$YELLOW"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs

# Install PM2
print_message "Installing PM2..." "$YELLOW"
npm install -y pm2 -g

# Create app directory
print_message "Creating application directory..." "$YELLOW"
mkdir -p $APP_PATH
mkdir -p $APP_PATH/data

# Set up Nginx
print_message "Configuring Nginx..." "$YELLOW"
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https:; img-src 'self' https: data:; font-src 'self' https: data:;";

    # Deny access to . files
    location ~ /\. {
        deny all;
    }

    # Deny access to database
    location ~ ^/data/.*\.db$ {
        deny all;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Set up SSL
print_message "Setting up SSL certificate..." "$YELLOW"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL

# Set permissions
print_message "Setting correct permissions..." "$YELLOW"
chown -R www-data:www-data $APP_PATH
chmod -R 755 $APP_PATH
chmod -R 777 $APP_PATH/data

# Create deployment script
cat > /usr/local/bin/deploy-$APP_NAME << EOF
#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_PATH="$APP_PATH"
BACKUP_PATH="\$APP_PATH/backups/\$(date +%Y%m%d_%H%M%S)"

# Create backup
echo -e "\${YELLOW}Creating backup...\${NC}"
mkdir -p \$BACKUP_PATH
if [ -f "\$APP_PATH/data/app.db" ]; then
    cp "\$APP_PATH/data/app.db" "\$BACKUP_PATH/"
fi

# Pull latest changes
echo -e "\${YELLOW}Pulling latest changes...\${NC}"
cd \$APP_PATH
git pull

# Install dependencies
echo -e "\${YELLOW}Installing dependencies...\${NC}"
npm ci --production

# Build application
echo -e "\${YELLOW}Building application...\${NC}"
npm run build

# Run migrations
echo -e "\${YELLOW}Running database migrations...\${NC}"
npm run db:migrate

# Restart application
echo -e "\${YELLOW}Restarting application...\${NC}"
pm2 restart $APP_NAME || pm2 start npm --name "$APP_NAME" -- start

# Set permissions
echo -e "\${YELLOW}Setting permissions...\${NC}"
chown -R www-data:www-data \$APP_PATH
chmod -R 755 \$APP_PATH
chmod -R 777 \$APP_PATH/data

echo -e "\${GREEN}Deployment completed successfully!\${NC}"
EOF

# Make deployment script executable
chmod +x /usr/local/bin/deploy-$APP_NAME

# Create initial deployment
print_message "Performing initial deployment..." "$YELLOW"
cd $APP_PATH
git clone https://github.com/yourusername/padelweer.git .
npm ci --production
npm run build
npm run db:migrate
pm2 start npm --name "$APP_NAME" -- start
pm2 save

# Set up automatic PM2 startup
pm2 startup

print_message "Installation completed successfully!" "$GREEN"
print_message "\nNext steps:" "$YELLOW"
print_message "1. Update your DNS settings to point to this server" "$NC"
print_message "2. Configure your environment variables in $APP_PATH/.env" "$NC"
print_message "3. Run 'deploy-$APP_NAME' to deploy updates" "$NC"
print_message "\nYour application should be accessible at: https://$DOMAIN" "$GREEN"