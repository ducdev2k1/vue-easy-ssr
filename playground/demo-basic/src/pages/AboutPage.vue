<script setup lang="ts">
/**
 * Component Name: AboutPage
 * Description: Trang giới thiệu với SEO meta - Dark Theme
 */
import { useHead } from "vue-easy-ssr";

// SEO meta tags
useHead({
  title: "About - Vue Easy SSR Demo",
  meta: [
    {
      name: "description",
      content: "Learn about Vue Easy SSR - The easiest way to add SSR to Vue 3",
    },
    { property: "og:title", content: "About Vue Easy SSR" },
  ],
});
</script>

<template>
  <div class="p-about">
    <h1 class="p-about__title">About Vue Easy SSR</h1>

    <section class="p-about__section">
      <h2>What is Vue Easy SSR?</h2>
      <p>
        Vue Easy SSR is a lightweight, zero-config SSR solution for Vue 3
        applications. It enables you to add Server-Side Rendering to your
        existing Vue 3 + Vite SPA in under 15 minutes.
      </p>
    </section>

    <section class="p-about__section">
      <h2>Why SSR?</h2>
      <ul class="p-about__list">
        <li>
          <span class="p-about__list-icon">🔍</span>
          <div>
            <strong>Better SEO</strong>
            <p>Search engines can crawl your fully-rendered HTML</p>
          </div>
        </li>
        <li>
          <span class="p-about__list-icon">⚡</span>
          <div>
            <strong>Faster LCP</strong>
            <p>Users see content immediately, no waiting for JavaScript</p>
          </div>
        </li>
        <li>
          <span class="p-about__list-icon">🚀</span>
          <div>
            <strong>Improved TTFB</strong>
            <p>Server sends complete HTML on first request</p>
          </div>
        </li>
        <li>
          <span class="p-about__list-icon">📱</span>
          <div>
            <strong>Social Sharing</strong>
            <p>Meta tags are visible to social media crawlers</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="p-about__section">
      <h2>Key Features</h2>
      <div class="p-about__features">
        <div class="p-about__feature">
          <span class="p-about__feature-icon">🎯</span>
          <h3>defineEasySSR()</h3>
          <p>Simple API to configure your SSR app</p>
        </div>
        <div class="p-about__feature">
          <span class="p-about__feature-icon">📡</span>
          <h3>useAsyncData()</h3>
          <p>Fetch data on server, hydrate on client</p>
        </div>
        <div class="p-about__feature">
          <span class="p-about__feature-icon">🏷️</span>
          <h3>useHead()</h3>
          <p>Manage SEO meta tags with ease</p>
        </div>
        <div class="p-about__feature">
          <span class="p-about__feature-icon">🔌</span>
          <h3>Vite Plugin</h3>
          <p>Seamless integration with Vite</p>
        </div>
      </div>
    </section>

    <section class="p-about__section p-about__section--verify">
      <h2>🔍 Verify SSR is Working</h2>
      <div class="p-about__verify">
        <p>
          Right-click this page and select
          <strong>"View Page Source"</strong> (or press <code>Ctrl+U</code>).
          You should see:
        </p>
        <ul class="p-about__check-list">
          <li>
            <span class="p-about__check">✅</span>
            This page content rendered in the HTML
          </li>
          <li>
            <span class="p-about__check">✅</span>
            Meta tags in the <code>&lt;head&gt;</code> section
          </li>
          <li>
            <span class="p-about__check">✅</span>
            <code>window.__INITIAL_STATE__</code> with hydration data
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.p-about {
  max-width: 800px;
  margin: 0 auto;
}

.p-about__title {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
}

.p-about__section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.p-about__section h2 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-accent);
  font-size: 1.25rem;
}

.p-about__section > p {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

/* List */
.p-about__list {
  list-style: none;
  padding: 0;
}

.p-about__list li {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.p-about__list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.p-about__list-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.p-about__list strong {
  color: var(--color-accent);
  display: block;
  margin-bottom: 0.25rem;
}

.p-about__list p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

/* Features */
.p-about__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.p-about__feature {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  text-align: center;
  transition: all 0.2s;
}

.p-about__feature:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.p-about__feature-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.p-about__feature h3 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  font-family: var(--font-mono);
}

.p-about__feature p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
}

/* Verify Section */
.p-about__section--verify {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-color: var(--color-accent);
}

.p-about__verify p {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.p-about__verify strong {
  color: var(--color-text-primary);
}

.p-about__check-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.p-about__check-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--color-text-secondary);
}

.p-about__check {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .p-about__title {
    font-size: 2rem;
  }

  .p-about__section {
    padding: 1.5rem;
  }
}
</style>
