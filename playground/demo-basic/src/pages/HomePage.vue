<script setup lang="ts">
/**
 * Component Name: HomePage
 * Description: Trang chủ demo useAsyncData và useHead - Dark Theme
 */
import { useAsyncData, useHead } from "vue-easy-ssr";

// SEO meta tags - rendered on server
useHead({
  title: "Home - Vue Easy SSR Demo",
  titleTemplate: "%s | Vue Easy SSR",
  meta: [
    {
      name: "description",
      content: "Vue Easy SSR demo - Enable SSR in under 15 minutes",
    },
    { property: "og:title", content: "Vue Easy SSR Demo" },
    {
      property: "og:description",
      content: "The easiest way to add SSR to your Vue 3 app",
    },
  ],
});

// Interface cho post data
interface IPost {
  id: number;
  title: string;
  body: string;
}

// Async data fetching - runs on server, hydrates on client
const {
  data: posts,
  pending,
  error,
} = useAsyncData<IPost[]>({
  key: "posts",
  handler: async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=6"
    );
    return response.json();
  },
  default: () => [],
});
</script>

<template>
  <div class="p-home">
    <!-- Hero Section -->
    <section class="p-home__hero">
      <div class="p-home__hero-glow"></div>
      <h1 class="p-home__title">
        <span class="p-home__title-icon">🚀</span>
        Vue Easy SSR
      </h1>
      <p class="p-home__subtitle">
        Enable Server-Side Rendering in under
        <strong>15 minutes</strong>
      </p>
      <div class="p-home__badges">
        <span class="p-home__badge p-home__badge--success">
          <span class="p-home__badge-dot"></span>
          SSR Enabled
        </span>
        <span class="p-home__badge p-home__badge--info">🏷️ SEO Ready</span>
        <span class="p-home__badge p-home__badge--warning">⚡ Hydrated</span>
      </div>
      <div class="p-home__cta">
        <a
          href="https://github.com/ducdev2k1/vue-easy-ssr"
          class="p-home__btn p-home__btn--primary"
        >
          Get Started
        </a>
        <a href="/about" class="p-home__btn p-home__btn--secondary">
          Learn More
        </a>
      </div>
    </section>

    <!-- Features -->
    <section class="p-home__features">
      <div class="p-home__feature">
        <div class="p-home__feature-icon">⚡</div>
        <h3>Fast Setup</h3>
        <p>Add SSR to existing Vue 3 apps with minimal configuration</p>
      </div>
      <div class="p-home__feature">
        <div class="p-home__feature-icon">🎯</div>
        <h3>SEO Optimized</h3>
        <p>Meta tags rendered in HTML source for search engines</p>
      </div>
      <div class="p-home__feature">
        <div class="p-home__feature-icon">📦</div>
        <h3>Framework Agnostic</h3>
        <p>Works with Vuetify, Element Plus, and more</p>
      </div>
    </section>

    <!-- Async Data Demo -->
    <section class="p-home__posts">
      <div class="p-home__posts-header">
        <h2>📝 Server-Side Fetched Posts</h2>
        <span class="p-home__posts-badge">useAsyncData Demo</span>
      </div>
      <p class="p-home__posts-info">
        This data was fetched on the server using <code>useAsyncData</code>.
        View page source to see it rendered in HTML!
      </p>

      <!-- Loading state -->
      <div v-if="pending" class="p-home__loading">
        <div class="p-home__spinner"></div>
        Loading posts...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-home__error">
        ❌ Error loading posts: {{ error.message }}
      </div>

      <!-- Posts list -->
      <div v-else class="p-home__posts-grid">
        <article v-for="post in posts" :key="post.id" class="p-home__post">
          <span class="p-home__post-id">#{{ post.id }}</span>
          <h4 class="p-home__post-title">{{ post.title }}</h4>
          <p class="p-home__post-body">{{ post.body.slice(0, 100) }}...</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========================================
   Hero Section
   ======================================== */
.p-home__hero {
  position: relative;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  overflow: hidden;
}

.p-home__hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse,
    rgba(102, 126, 234, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.p-home__title {
  position: relative;
  font-size: 3.5rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.p-home__title-icon {
  font-size: 3rem;
  -webkit-text-fill-color: initial;
}

.p-home__subtitle {
  position: relative;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.p-home__subtitle strong {
  color: var(--color-accent);
}

.p-home__badges {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.p-home__badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.p-home__badge--success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.3);
}

.p-home__badge-dot {
  width: 8px;
  height: 8px;
  background: var(--color-success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.p-home__badge--info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
  border-color: rgba(59, 130, 246, 0.3);
}

.p-home__badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
  border-color: rgba(245, 158, 11, 0.3);
}

.p-home__cta {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.p-home__btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.p-home__btn--primary {
  background: var(--gradient-accent);
  color: white;
}

.p-home__btn--primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.p-home__btn--secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.p-home__btn--secondary:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-accent);
}

/* ========================================
   Features
   ======================================== */
.p-home__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.p-home__feature {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: var(--radius-md);
  text-align: center;
  transition: all 0.2s;
}

.p-home__feature:hover {
  background: var(--color-bg-card-hover);
  border-color: var(--color-accent);
  transform: translateY(-4px);
}

.p-home__feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.p-home__feature h3 {
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-size: 1.125rem;
}

.p-home__feature p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

/* ========================================
   Posts Section
   ======================================== */
.p-home__posts {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: var(--radius-md);
}

.p-home__posts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.p-home__posts h2 {
  color: var(--color-text-primary);
  font-size: 1.5rem;
}

.p-home__posts-badge {
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-accent);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.p-home__posts-info {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.p-home__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.p-home__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.p-home__error {
  text-align: center;
  padding: 2rem;
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-sm);
}

.p-home__posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.p-home__post {
  position: relative;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.p-home__post:hover {
  border-color: var(--color-accent);
}

.p-home__post-id {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-family: var(--font-mono);
}

.p-home__post-title {
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  padding-right: 2rem;
}

.p-home__post-body {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 768px) {
  .p-home__title {
    font-size: 2.5rem;
    flex-direction: column;
  }

  .p-home__hero {
    padding: 2rem 1rem;
  }

  .p-home__cta {
    flex-direction: column;
  }

  .p-home__btn {
    width: 100%;
    text-align: center;
  }
}
</style>
