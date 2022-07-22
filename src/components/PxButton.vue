<template>
  <button
    v-on:click="buttonClick"
    class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded"
  >
    <beat-loader :loading="isLoading" :color="'#68d391'"></beat-loader>
    <slot v-if="!isLoading" name="button_text"></slot>
  </button>
</template>

<script>
import BeatLoader from "vue-spinner/src/BeatLoader.vue";

export default {
  name: "PxButton",
  methods: {
    buttonClick: function () {
      this.$emit("custom-click");
    },
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BeatLoader,
  },
};
</script>
