<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="'#68d391'"></bounce-loader>
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            class="w-20 h-20 mr-5"
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500"> ({{ asset.symbol }}) </small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ dollar(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ dollar(minPrice) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ dollar(maxPrice) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ dollar(avgPrice) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ percent(asset.changePercent24Hr) }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            v-on:click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}</span
          >
        </div>
      </div>
      <div>
        <line-chart
          class="my-10"
          :colors="['orange']"
          :min="minPrice"
          :max="maxPrice"
          :data="historyData"
          :fill="0.5"
        ></line-chart>
      </div>
      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>
            {{ dollar(m.priceUsd) }}
          </td>
          <td>{{ m.baseSymbol }} - {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :is-loading="m.isLoading || false"
              v-on:custom-click="getWebsite(m)"
              v-if="!m.url"
            >
              <template v-slot:button_text>
                <span>Obtener URL</span>
              </template>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">{{
              m.url
            }}</a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/api.js";
import { dollarFilter, percentFilter, dollarChartFilter } from "@/filters";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import PxButton from "@/components/PxButton.vue";

export default {
  name: "PxCoinDetail",
  data: () => {
    return {
      asset: {},
      history: [],
      markets: [],
      isLoading: false,
      fromUsd: true,
      convertValue: null,
    };
  },
  watch: {
    $route() {
      this.getCoin();
    },
  },
  computed: {
    minPrice: function () {
      const prices = this.history.map((h) => parseFloat(h.priceUsd));
      return prices.reduce(
        (previousValue, currentValue) => Math.min(previousValue, currentValue),
        Infinity
      );
    },
    maxPrice: function () {
      const prices = this.history.map((h) => parseFloat(h.priceUsd));
      return prices.reduce(
        (previousValue, currentValue) => Math.max(previousValue, currentValue),
        Number.NEGATIVE_INFINITY
      );
    },
    avgPrice: function () {
      const prices = this.history.map((h) => parseFloat(h.priceUsd));
      return (
        prices.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        ) / this.history.length
      );
    },
    historyData: function () {
      const data = [];
      this.history.map((h) =>
        data.push([h.date, this.dollarChart(h.priceUsd)])
      );
      return data;
    },
    convertResult: function () {
      if (!this.convertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      return this.dollarChart(result);
    },
  },
  methods: {
    getWebsite: async function (exchange) {
      exchange.isLoading = true;
      return await api
        .getExchange(exchange.exchangeId)
        .then((res) => {
          exchange.url = res.exchangeUrl;
        })
        .finally(() => (exchange.isLoading = false));
    },
    getCoin: async function () {
      const id = this.$route.params.id;
      this.isLoading = true;
      Promise.all([
        await api.getAsset(id),
        await api.getAssetHistory(id),
        await api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .finally(() => (this.isLoading = false));
    },
    dollar: function (value) {
      return dollarFilter(value);
    },
    percent: function (value) {
      return percentFilter(value);
    },
    dollarChart: function (value) {
      return dollarChartFilter(value);
    },
    toggleConverter: function () {
      this.fromUsd = !this.fromUsd;
    },
  },
  components: {
    BounceLoader,
    PxButton,
  },
  created() {
    this.getCoin();
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
