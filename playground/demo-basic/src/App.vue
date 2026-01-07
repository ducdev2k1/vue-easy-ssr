<script setup lang="ts">
/**
 * Component Name: App
 * Description: Root component với RouterView và navigation - Dark Theme
 */
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="app">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav__container">
        <RouterLink to="/" class="nav__brand">
          <span class="nav__logo">🚀</span>
          Vue Easy SSR
        </RouterLink>
        <div class="nav__links">
          <RouterLink to="/" class="nav__link">Home</RouterLink>
          <RouterLink to="/about" class="nav__link">About</RouterLink>
          <RouterLink to="/users" class="nav__link">Users</RouterLink>
          <a
            href="https://github.com/ducdev2k1/vue-easy-ssr"
            target="_blank"
            class="nav__link nav__link--github"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>Powered by <strong>vue-easy-ssr</strong> 🚀 | Built for Developers</p>
    </footer>
  </div>
</template>

<style>
/* ========================================
   Dark Theme Variables
   ======================================== */
:root {
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-bg-card: #1a1a24;
  --color-bg-card-hover: #22222e;

  --color-text-primary: #e5e5e5;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #666666;

  /* Vue.js Brand Colors */
  --color-vue-green: #42b883;
  --color-vue-dark: #35495e;
  --color-accent: #42b883;
  --color-accent-secondary: #35495e;
  --gradient-accent: linear-gradient(135deg, #42b883 0%, #35495e 100%);

  --color-border: #2a2a36;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.5);

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;

  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
}

/* ========================================
   Global Reset & Base Styles
   ======================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  line-height: 1.6;
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========================================
   Navigation
   ======================================== */
.nav {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav__brand:hover {
  opacity: 0.9;
}

.nav__logo {
  font-size: 1.5rem;
}

.nav__links {
  display: flex;
  gap: 0.5rem;
}

.nav__link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.nav__link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-card);
}

.nav__link.router-link-active {
  color: var(--color-accent);
  background: rgba(102, 126, 234, 0.1);
}

.nav__link--github {
  background: var(--gradient-accent);
  color: white !important;
}

.nav__link--github:hover {
  opacity: 0.9;
  background: var(--gradient-accent);
}

/* ========================================
   Main Content
   ======================================== */
.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* ========================================
   Footer
   ======================================== */
.footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

.footer strong {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========================================
   Utility Classes
   ======================================== */
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all 0.2s;
}

.card:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

code {
  font-family: var(--font-mono);
  background: var(--color-bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-accent);
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 768px) {
  .nav__container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav__links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .main {
    padding: 1rem;
  }
}
</style>
