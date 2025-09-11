import { createRouter, createWebHistory } from "vue-router";
import mainPage from "@/pages/mainPage.vue";
import registerPage from "@/pages/registerPage.vue";
import startPage from "@/pages/startPage.vue";

const routes = [
  { path: "/", name: "start", component: mainPage },
  { path: "/home", name: "Home", component: mainPage },
  { path: "/register", name: "Register", component: registerPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
