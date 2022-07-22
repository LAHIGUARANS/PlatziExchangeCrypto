import { createRouter, createWebHistory } from "vue-router";
import PxHome from "@/views/Home.vue";
import PxAbout from "@/views/About.vue";
import PxError from "@/views/Error.vue";
import PxCoinDetail from "@/views/CoinDetail.vue";

const history = createWebHistory();

export default createRouter({
  history: history,
  routes: [
    {
      path: "/",
      name: "home",
      component: PxHome,
    },
    {
      path: "/about",
      name: "about",
      component: PxAbout,
    },
    {
      path: "/coin/:id(.*)",
      name: "coindetail",
      component: PxCoinDetail,
    },
    {
      path: "/:catchAll(.*)",
      name: "error",
      component: PxError,
    },
  ],
});
