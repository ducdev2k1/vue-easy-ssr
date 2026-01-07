<script setup lang="ts">
/**
 * Component Name: UsersPage
 * Description: Trang demo useAsyncData với user list từ JSONPlaceholder API
 */
import { useAsyncData, useHead } from "vue-easy-ssr";

// SEO meta tags
useHead({
  title: "Users - Vue Easy SSR Demo",
  meta: [
    {
      name: "description",
      content: "Demo of useAsyncData with user list - Vue Easy SSR",
    },
  ],
});

// Interface cho user data
interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    city: string;
    street: string;
  };
}

// Fetch users on server
const {
  data: users,
  pending,
  error,
  refresh,
} = useAsyncData<IUser[]>({
  key: "users",
  handler: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    return response.json();
  },
  default: () => [],
});
</script>

<template>
  <div class="p-users">
    <div class="p-users__header">
      <div>
        <h1 class="p-users__title">👥 Users Directory</h1>
        <p class="p-users__subtitle">
          Server-rendered user list using <code>useAsyncData</code>
        </p>
      </div>
      <button class="p-users__refresh" @click="refresh" :disabled="pending">
        <span v-if="pending" class="p-users__spinner"></span>
        <span v-else>🔄</span>
        Refresh
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="p-users__loading">
      <div class="p-users__loading-spinner"></div>
      <p>Loading users...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-users__error">
      <span>❌</span>
      <p>Error loading users: {{ error.message }}</p>
      <button @click="refresh" class="p-users__retry">Try Again</button>
    </div>

    <!-- Users grid -->
    <div v-else class="p-users__grid">
      <article v-for="user in users" :key="user.id" class="p-users__card">
        <div class="p-users__card-header">
          <div class="p-users__avatar">
            {{ user.name.charAt(0) }}
          </div>
          <div class="p-users__info">
            <h3 class="p-users__name">{{ user.name }}</h3>
            <span class="p-users__username">@{{ user.username }}</span>
          </div>
        </div>

        <div class="p-users__details">
          <div class="p-users__detail">
            <span class="p-users__detail-icon">📧</span>
            <a :href="`mailto:${user.email}`" class="p-users__link">
              {{ user.email.toLowerCase() }}
            </a>
          </div>
          <div class="p-users__detail">
            <span class="p-users__detail-icon">📍</span>
            <span>{{ user.address.city }}</span>
          </div>
          <div class="p-users__detail">
            <span class="p-users__detail-icon">🏢</span>
            <span>{{ user.company.name }}</span>
          </div>
          <div class="p-users__detail">
            <span class="p-users__detail-icon">🌐</span>
            <a
              :href="`https://${user.website}`"
              target="_blank"
              class="p-users__link"
            >
              {{ user.website }}
            </a>
          </div>
        </div>

        <div class="p-users__tagline">"{{ user.company.catchPhrase }}"</div>
      </article>
    </div>

    <!-- Info box -->
    <div class="p-users__info-box">
      <h3>💡 How it works</h3>
      <p>
        This page demonstrates <code>useAsyncData</code> with a real API call.
        The data is fetched on the server and embedded in the HTML. Check the
        page source to see the pre-rendered user data!
      </p>
      <pre><code>const { data: users } = useAsyncData&lt;IUser[]&gt;({
  key: "users",
  handler: async () => {
    return fetch("/api/users").then(r => r.json());
  },
});</code></pre>
    </div>
  </div>
</template>

<style scoped>
.p-users {
  max-width: 1200px;
  margin: 0 auto;
}

.p-users__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.p-users__title {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.p-users__subtitle {
  color: var(--color-text-secondary);
}

.p-users__refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.p-users__refresh:hover:not(:disabled) {
  background: var(--color-bg-card-hover);
  border-color: var(--color-accent);
}

.p-users__refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.p-users__spinner {
  width: 16px;
  height: 16px;
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

/* Loading */
.p-users__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--color-text-secondary);
}

.p-users__loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* Error */
.p-users__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-error);
}

.p-users__error span {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.p-users__retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

/* Grid */
.p-users__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Card */
.p-users__card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all 0.2s;
}

.p-users__card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.p-users__card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.p-users__avatar {
  width: 48px;
  height: 48px;
  background: var(--gradient-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.p-users__info {
  flex: 1;
}

.p-users__name {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  margin-bottom: 0.125rem;
}

.p-users__username {
  color: var(--color-accent);
  font-size: 0.875rem;
  font-family: var(--font-mono);
}

.p-users__details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.p-users__detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.p-users__detail-icon {
  width: 20px;
  text-align: center;
}

.p-users__link {
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

.p-users__link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.p-users__tagline {
  font-style: italic;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

/* Info box */
.p-users__info-box {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.p-users__info-box h3 {
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.p-users__info-box p {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.p-users__info-box pre {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  padding: 1rem;
  overflow-x: auto;
}

.p-users__info-box pre code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-primary);
  background: transparent;
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .p-users__grid {
    grid-template-columns: 1fr;
  }
}
</style>
