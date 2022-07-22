<template>
  <div>
    <bounce-loader :loading="isLoading" :color="'#68d391'"></bounce-loader>
    <px-assets-table v-if="!isLoading" :assets="assets"></px-assets-table>
  </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable.vue";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import api from "@/api.js";

export default {
  name: "PxHome",
  components: {
    PxAssetsTable,
    BounceLoader,
  },
  data: () => {
    return {
      assets: [],
      isLoading: false,
    };
  },
  async created() {
    this.isLoading = true;
    await api
      .getAssets()
      .then((data) => (this.assets = data))
      .finally(() => (this.isLoading = false));
  },
};
</script>
