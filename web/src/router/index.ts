import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
// 引入stores中的store
import { useAdminStore } from "@/stores/admin";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue")
    }
  ]
});
router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore();
  if (to.path !== "/login" && adminStore.access_exp < Date.now()) {
    adminStore.access_token = "";
    adminStore.refresh_token = "";
    next("/login");
  } else if (to.path == "/login") {
    adminStore.access_token = "";
    adminStore.refresh_token = "";
  }
  next();
});

export default router;
