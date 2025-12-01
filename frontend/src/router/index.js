import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useAuth } from "@/composables/useAuth";
import mainPage from "@/pages/InventoryPage.vue";
import registerPage from "@/pages/RegisterPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import newCampaign from "@/pages/newCampaign.vue";

const routes = [
  { path: "/", name: "start", component: LoginPage },
  { path: "/home", name: "Home", component: mainPage },
  { path: "/register", name: "Register", component: registerPage },
  {
    path: "/newCampaign",
    name: "newCampaign",
    component: newCampaign,
    meta: { requiresAuth: true, requiredRole: "Admin" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn, getRole } = useAuth();

  if (to.meta.requiresAuth && !isLoggedIn()) {
    return next("/");
  }

  if (to.meta.requiredRole) {
    const userRole = getRole();
    if (userRole !== to.meta.requiredRole) {
      return next("/home");
    }
  }

  next();
});

export default router;
