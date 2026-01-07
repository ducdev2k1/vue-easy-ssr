/**
 * SSR Development Server
 *
 * Server này handle SSR rendering trong development mode.
 * Sử dụng Vite dev server làm middleware để hot reload.
 */

import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'

async function createServer() {
    const app = express()

    let vite

    if (!isProd) {
        // Development mode: use Vite dev server as middleware
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
        })

        // Use vite's connect instance as middleware
        app.use(vite.middlewares)
    } else {
        // Production mode: serve static files
        app.use(express.static(path.resolve(__dirname, 'dist/client'), {
            index: false, // Don't serve index.html for root, we'll handle SSR
        }))
    }

    // Handle all routes with SSR
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl

        try {
            let template
            let render

            if (!isProd) {
                // Development: read template from disk and transform with Vite
                template = fs.readFileSync(
                    path.resolve(__dirname, 'index.html'),
                    'utf-8'
                )
                template = await vite.transformIndexHtml(url, template)

                // Load server entry with Vite's SSR module loader
                const { render: ssrRender } = await vite.ssrLoadModule('/src/entry-server.ts')
                render = ssrRender
            } else {
                // Production: use pre-built files
                template = fs.readFileSync(
                    path.resolve(__dirname, 'dist/client/index.html'),
                    'utf-8'
                )

                // Import pre-built server entry
                const serverModule = await import('./dist/server/entry-server.js')
                render = serverModule.render
            }

            // Render the app
            const html = await render(url, template)

            // Send the rendered HTML
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // Handle errors
            if (!isProd && vite) {
                vite.ssrFixStacktrace(e)
            }

            console.error(e)
            res.status(500).end(e.message)
        }
    })

    const port = process.env.PORT || 3000

    app.listen(port, () => {
        console.log(`
  🚀 SSR Server running at http://localhost:${port}

  ${isProd ? '📦 Production mode' : '🔧 Development mode with HMR'}

  Open the URL and view page source to see SSR in action!
    `)
    })
}

createServer()
