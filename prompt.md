You are a senior open-source maintainer and Vue 3 SSR expert.

You are working inside an existing Git repository named **"vue-easy-ssr"**.
The project uses **pnpm workspace** and follows long-term open-source conventions.

---

## Repository Structure (MUST follow exactly)

vue-easy-ssr/
├─ packages/
│  └─ vue-easy-ssr/        # SSR plugin (npm package)
│
├─ playground/
│  └─ demo-basic/          # Demo Vue 3 + Vite SSR app
│
├─ docs/                   # Documentation (VitePress / Markdown)
│
├─ scripts/                # Dev & build scripts
│
├─ package.json            # Root (private)
├─ pnpm-workspace.yaml
├─ LICENSE                 # MIT
└─ README.md

---

## Tooling & Constraints
- Package manager: **pnpm only**
- Language: **TypeScript**
- Framework: **Vue 3**
- Bundler: **Vite**
- SSR runtime: **Node.js**
- License: **MIT**
- Do NOT use Nuxt
- Do NOT mix demo or docs code into the plugin package

---

## Plugin Package Responsibilities
Location: `/packages/vue-easy-ssr`

The plugin must:
- Export `defineEasySSR()` API
- Provide a Vite plugin to enable SSR
- Handle:
  - `createSSRApp`
  - Vue Router SSR
  - Pinia SSR state serialization & hydration
  - HTML head rendering (SEO)
- Export composables:
  - `useAsyncData`
  - `useHead`
- Be framework-agnostic (works with Vuetify, DevExtreme, etc.)
- Be publishable to npm as `vue-easy-ssr`

The plugin must NOT:
- Contain demo code
- Depend on `playground` or `docs`

---

## Demo App Responsibilities
Location: `/playground/demo-basic`

The demo app must:
- Be a clean Vue 3 + Vite project
- Consume `vue-easy-ssr` via pnpm workspace linking
- Demonstrate:
  - SSR rendering real HTML content
  - At least 2 routes
  - One async data page rendered on server
  - SEO meta tags visible in page source
- Be used for:
  - Manual testing
  - Debugging
  - Reproducing SSR issues

---

## Documentation Responsibilities
Location: `/docs`

The docs must:
- Explain:
  - What vue-easy-ssr is
  - When to use it vs Nuxt
  - How to install
  - How to enable SSR in an existing SPA
- Include:
  - Getting Started guide
  - API reference for `defineEasySSR`
  - Deployment guide (Node / VPS)
- Be compatible with VitePress (future-ready)

---

## Development Workflow
- Use pnpm workspace linking
- Plugin changes should reflect immediately in the demo app
- Provide scripts to:
  - Run SSR dev mode
  - Build client + server bundles
  - Preview SSR output
  - Build documentation

---

## Required Initial Tasks
1. Create `pnpm-workspace.yaml`
2. Create root `package.json` (private)
3. Add MIT `LICENSE`
4. Initialize `/packages/vue-easy-ssr` (TypeScript library)
5. Initialize `/playground/demo-basic` (Vite + Vue 3)
6. Initialize `/docs` (basic structure, no site yet)
7. Wire demo app to use the plugin
8. Ensure SSR renders at least one route successfully

---

## Code Quality Requirements
- Clean architecture
- Clear separation of concerns
- Minimal configuration for end users
- Meaningful comments explaining SSR flow

---

## Final Goal
An existing Vue 3 + Vite SPA can enable SSR in **under 15 minutes** using vue-easy-ssr,
with improved SEO, LCP, and TTFB.

Start by scaffolding the workspace and basic SSR flow.
