# Deployment Guide

## Production Build

Running the build command automatically builds both client and server bundles:

```bash
pnpm build
# Runs 'vite build'
```

This generates a `dist` folder:

```
dist/
├── client/              # Static assets (HTML, CSS, JS)
└── server/              # Production server
    ├── server.js        # Node.js Express server
    ├── entry.js         # SSR Bundle
    └── package.json     # Server dependencies
```

## Running in Production

You can run the generated server directly:

```bash
node dist/server/server.js
```

Or deploy the `dist` folder:

### Node.js Server (VPS)

1. Build your app locally or in CI: `pnpm build`
2. Copy `dist` folder to your server
3. Go to `dist/server`: `cd dist/server`
4. Install dependencies: `npm install --production`
5. Run with PM2: `pm2 start server.js --name my-app`

### Docker

Since the server relies on `../client` to serve static assets, you need to keep the folder structure.

```dockerfile
# Build Stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Run Stage
FROM node:20-alpine
WORKDIR /app

# Copy dist (both client and server)
COPY --from=builder /app/dist ./dist

# Working directory inside server
WORKDIR /app/dist/server

# Install server dependencies
RUN npm install --production

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
```

## Performance Tips

1. **Use compression middleware** - The generated server is minimal. You can modify the template or put Nginx in front for compression.
2. **Use CDN** - Serve static assets (`dist/client/assets`) from a CDN for better performance.
3. **Cache Control** - `server.js` sets `maxAge: '1y'` for static assets in production.
4. **Process Manager** - Always use PM2 or Docker in production to handle restarts.
