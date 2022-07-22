<template>
  <main>
    <px-header v-bind:links="links"></px-header>
    <router-view
      class="container px-5 sm:px-20 py-20 flex justify-center"
    ></router-view>
  </main>
</template>

<script>
import PxHeader from "@/components/PxHeader.vue";

export default {
  name: "App",
  data: () => {
    return {
      links: [
        {
          title: "BTC",
          to: { name: "coindetail", params: { id: "bitcoin" } },
        },
        {
          title: "ETH",
          to: { name: "coindetail", params: { id: "ethereum" } },
        },
        {
          title: "XRP",
          to: { name: "coindetail", params: { id: "xrp" } },
        },
      ],
    };
  },
  components: {
    PxHeader,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
