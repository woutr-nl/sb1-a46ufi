# Deployment Guide for Hetzner/DigitalOcean

This guide helps you deploy the Padel Weather application on Hetzner or DigitalOcean servers.

## Prerequisites

- A Hetzner or DigitalOcean account
- A domain name pointing to your server
- Ubuntu 20.04 LTS or newer

## Quick Start

1. SSH into your server:
   ```bash
   ssh root@your-server-ip
   ```

2. Download the setup script:
   ```bash
   curl -O https://raw.githubusercontent.com/yourusername/padelweer/main/deploy/setup.sh
   chmod +x setup.sh
   ```

3. Run the setup script:
   ```bash
   ./setup.sh
   ```

4. Follow the prompts to enter your domain name and email address.

## What the Script Does

1. Updates the system
2. Installs required packages (Node.js, Nginx, SQLite, etc.)
3. Configures Nginx with SSL (using Let's Encrypt)
4. Sets up PM2 for process management
5. Creates deployment scripts
6. Sets appropriate permissions
7. Performs initial deployment

## Manual Deployment

To deploy updates manually:

```bash
deploy-padelweer
```

This will:
- Back up the current database
- Pull latest changes
- Install dependencies
- Build the application
- Run migrations
- Restart the application

## Server Specifications

Recommended server specifications:

### Minimum Requirements
- 1 CPU
- 2GB RAM
- 20GB SSD

### Recommended
- 2 CPU
- 4GB RAM
- 40GB SSD

## Monitoring

The application is monitored using PM2. Common commands:

```bash
# View logs
pm2 logs padelweer

# Monitor processes
pm2 monit

# View status
pm2 status
```

## Backup

Backups are automatically created before each deployment in:
```
/var/www/padelweer/backups/
```

## Troubleshooting

1. **502 Bad Gateway**
   ```bash
   # Check Nginx logs
   tail -f /var/log/nginx/error.log
   
   # Check application logs
   pm2 logs padelweer
   ```

2. **Database Issues**
   ```bash
   # Check permissions
   ls -la /var/www/padelweer/data
   
   # Fix permissions
   chmod -R 777 /var/www/padelweer/data
   ```

3. **SSL Issues**
   ```bash
   # Renew certificate manually
   certbot renew --force-renewal
   ```

## Security

The setup includes:
- SSL/TLS encryption
- Security headers
- Database access restrictions
- Regular system updates
- Process management
- Backup system

## Support

For issues:
1. Check the logs using PM2
2. Review Nginx error logs
3. Check system resources
4. Contact support team

## License

MIT License - see LICENSE file for details