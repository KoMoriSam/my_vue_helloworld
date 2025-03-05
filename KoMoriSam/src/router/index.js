import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
      meta: { title: "404 | KoMoriSam" },
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { title: "主页 | KoMoriSam" },
    },
    {
      path: "/novel",
      name: "novel",
      component: () => import("../views/NovelView.vue"),
      meta: { title: "小说 | KoMoriSam" },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
      meta: { title: "联系 | KoMoriSam" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { title: "关于 | KoMoriSam" },
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Welcome KoMoriSam's Website!";

  next();
});
