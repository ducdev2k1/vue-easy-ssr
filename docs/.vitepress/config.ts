import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vue Easy SSR",
  description: "Enable Server-Side Rendering for Vue 3 in under 15 minutes",

  // Dark mode by default (for developers)
  appearance: "dark",

  head: [
    ["meta", { name: "theme-color", content: "#667eea" }],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "og:site_name", content: "Vue Easy SSR" }],
  ],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "API", link: "/api/define-easy-ssr" },
      { text: "GitHub", link: "https://github.com/ducdev2k1/vue-easy-ssr" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Deployment", link: "/deployment" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "defineEasySSR", link: "/api/define-easy-ssr" },
          { text: "useAsyncData", link: "/api/use-async-data" },
          { text: "useHead", link: "/api/use-head" },
        ],
      },
      {
        text: "Guides",
        items: [{ text: "Vuetify Integration", link: "/guides/vuetify" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/ducdev2k1/vue-easy-ssr" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 Nguyễn Đăng Đức",
    },

    search: {
      provider: "local",
    },
  },
});
