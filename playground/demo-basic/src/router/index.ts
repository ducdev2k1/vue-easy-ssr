import {
  createMemoryHistory,
  createRouter as createVueRouter,
  createWebHistory,
} from "vue-router";

// Lazy load pages để tối ưu bundle size
const HomePage = () => import("../pages/HomePage.vue");
const AboutPage = () => import("../pages/AboutPage.vue");
const UsersPage = () => import("../pages/UsersPage.vue");

/**
 * Create router instance
 *
 * Tạo router mới cho mỗi request (server) hoặc một lần (client).
 * Sử dụng memory history trên server, web history trên client.
 */
export const createRouter = () => {
  const isServer = typeof window === "undefined";

  return createVueRouter({
    // Memory history cho server, web history cho client
    history: isServer ? createMemoryHistory() : createWebHistory(),

    routes: [
      {
        path: "/",
        name: "home",
        component: HomePage,
        meta: {
          title: "Home",
        },
      },
      {
        path: "/about",
        name: "about",
        component: AboutPage,
        meta: {
          title: "About",
        },
      },
      {
        path: "/users",
        name: "users",
        component: UsersPage,
        meta: {
          title: "Users",
        },
      },
    ],
  });
};
