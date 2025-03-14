import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: () => ({
        name: "home",
      }),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { title: "主页 | KoMoriSam" },
    },
    {
      path: "/novel",
      redirect: () => ({
        name: "novel",
        params: { chapterId: 1, page: 1 },
      }),
    },
    {
      path: "/novel/:chapterId/page/:page",
      name: "novel",
      component: () => import("@/views/NovelView.vue"),
      props: (route) => ({
        chapterId: Number(route.params.chapterId) || 1,
        page: Number(route.params.page) || 1,
      }),
      meta: { title: "小说 | KoMoriSam" },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/views/ContactView.vue"),
      meta: { title: "联系 | KoMoriSam" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
      meta: { title: "关于 | KoMoriSam" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { title: "404! | KoMoriSam" },
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Welcome KoMoriSam's Website!";

  next();
});
