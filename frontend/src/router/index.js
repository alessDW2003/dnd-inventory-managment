import { createRouter, createWebHistory } from "vue-router";
import mainPage from "@/pages/mainPage.vue";
import registerPage from "@/pages/registerPage.vue";

const routes = [
  { path: "/", name: "Register", component: registerPage },
  { path: "/home", name: "Home", component: mainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
