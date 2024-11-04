# Dutch Padel Weather Forecast

A professional weather forecast application specifically designed for padel players in the Netherlands. The application provides detailed weather information and playing condition scores to help players make informed decisions about their games.

## Features

- 7-day weather forecast with hourly details
- Padel-specific playing condition scores
- Location-based weather data
- Dark mode support
- Admin dashboard for customization
- Responsive design for all devices
- Caching system for optimal performance

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- A Visual Crossing Weather API key (get one at [Visual Crossing](https://www.visualcrossing.com/weather-api))

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd dutch-padel-weather
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_WEATHER_API_KEY=your_visual_crossing_api_key
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Deployment

### Static Hosting (Recommended)

The application is built as a static site and can be deployed to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` directory to your hosting service

Popular hosting options:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Traditional Web Server

If deploying to a traditional web server:

1. Build the project:
```bash
npm run build
```

2. Copy the contents of the `dist` directory to your web server's public directory

3. Configure your web server to handle client-side routing:

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx (nginx.conf)
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_WEATHER_API_KEY | Visual Crossing Weather API key | Yes |

## Admin Access

Default admin credentials:
- Username: admin
- Password: padel123

**Important:** Change these credentials in production by modifying the `src/store/weatherStore.ts` file.

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

MIT License - see LICENSE file for details