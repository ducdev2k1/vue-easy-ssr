# Deployment Guide

## Production Build

Build both client and server bundles:

```bash
# Build client bundle
vite build --outDir dist/client

# Build server bundle
vite build --ssr src/entry-server.ts --outDir dist/server
```

## Running in Production

```bash
NODE_ENV=production node server.js
```

## Deployment Options

### Node.js Server (VPS)

1. Build your app locally or in CI
2. Copy `dist/`, `server.js`, and `package.json` to your server
3. Install production dependencies: `pnpm install --prod`
4. Run with PM2: `pm2 start server.js --name my-app`

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY dist ./dist
COPY server.js ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
```

### Serverless (Not Recommended)

Vue Easy SSR is designed for long-running Node.js servers. For serverless deployments, consider using Nuxt or other serverless-optimized frameworks.

## Performance Tips

1. **Use compression middleware** - Add `compression` package to Express
2. **Enable caching** - Cache rendered HTML for static pages
3. **Use CDN** - Serve static assets from a CDN
4. **Monitor memory** - SSR can be memory-intensive, monitor your server
