# Installing on Shared Hosting

This guide explains how to install and run the Padel Weather application on shared hosting environments.

## Prerequisites

Your shared hosting environment must have:

- Node.js 18.0.0 or higher
- SQLite3 support
- Ability to run Node.js applications
- SSH access (recommended)

## Installation Steps

1. **Upload Files**

   Upload all project files to your hosting environment using FTP or SSH. Example using SSH:

   ```bash
   scp -r * username@your-host.com:~/public_html/padelweer
   ```

2. **Configure Database**

   Create a `data` directory in your hosting environment and ensure it has proper permissions:

   ```bash
   mkdir data
   chmod 755 data
   ```

   The SQLite database will be stored in `data/app.db`.

3. **Install Dependencies**

   Connect to your hosting via SSH and run:

   ```bash
   npm install --production
   ```

4. **Build the Application**

   Create the production build:

   ```bash
   npm run build
   ```

5. **Initialize Database**

   Run the database migration:

   ```bash
   npm run db:migrate
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in your project root:

   ```env
   VITE_WEATHER_API_KEY=your_visual_crossing_api_key
   ```

2. **Database Configuration**

   The default configuration uses SQLite. Update `src/config/database.ts` if needed:

   ```typescript
   const defaultConfig: DatabaseConfig = {
     type: 'sqlite',
     sqlite: {
       path: './data/app.db'
     }
   };
   ```

## Hosting-Specific Setups

### cPanel

1. Create a Node.js application:
   - Go to `Setup Node.js App` in cPanel
   - Choose your Node.js version (18.x or higher)
   - Set application root to your upload directory
   - Set application URL
   - Set application startup file to `server.js`

2. Create `server.js` in your project root:

   ```javascript
   import express from 'express';
   import { handler } from './dist/server/entry.mjs';
   import { fileURLToPath } from 'url';
   import { dirname, join } from 'path';

   const __dirname = dirname(fileURLToPath(import.meta.url));
   const app = express();

   // Serve static files
   app.use(express.static(join(__dirname, 'dist/client')));

   // Handle API routes
   app.use(handler);

   const port = process.env.PORT || 3000;
   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

### DirectAdmin

1. Create a new subdomain or domain
2. Enable Node.js support
3. Set up a custom Node.js configuration:
   - Application root: `/public_html/your-app-directory`
   - Node.js version: 18.x or higher
   - Start command: `node server.js`

### Plesk

1. Go to Node.js in your domain's settings
2. Enable Node.js support
3. Set application root
4. Set Node.js version to 18.x or higher
5. Set startup file to `server.js`
6. Set application URL

## File Permissions

Set correct permissions for files and directories:

```bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 755 data
chmod 666 data/app.db
```

## Troubleshooting

### Common Issues

1. **Database Permissions**
   ```bash
   Error: SQLITE_CANTOPEN: unable to open database file
   ```
   Solution: Check data directory and file permissions

2. **Node.js Version**
   ```bash
   Error: The engine "node" is incompatible with this module
   ```
   Solution: Ensure Node.js 18.x or higher is installed

3. **Build Errors**
   ```bash
   Error: Cannot find module '@vitejs/plugin-react'
   ```
   Solution: Run `npm install` before building

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
export DEBUG=app:*
```

## Security Considerations

1. **Database Security**
   - Keep the `data` directory outside public web root
   - Set restrictive file permissions
   - Regular backups

2. **API Key Security**
   - Store API keys in environment variables
   - Never commit `.env` file

3. **Admin Access**
   - Change default admin password immediately
   - Use strong passwords
   - Consider IP restrictions if possible

## Maintenance

1. **Updates**
   ```bash
   git pull
   npm install
   npm run build
   pm2 restart server
   ```

2. **Backups**
   ```bash
   # Backup database
   cp data/app.db data/app.db.backup
   ```

3. **Logs**
   - Check hosting provider's log viewer
   - Monitor `npm-debug.log`
   - Check application logs in `logs` directory

## Support

For issues:
1. Check the troubleshooting section
2. Review hosting provider's Node.js documentation
3. Open an issue on GitHub
4. Contact your hosting provider's support

## License

MIT License - see LICENSE file for details