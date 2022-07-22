<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }">
          <span class="underline cursor-pointer" v-on:click="changeSortOrder"
            >Ranking</span
          >
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="a in filteredAssets"
        :key="a.id"
        class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
      >
        <td>
          <img
            :src="`https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`"
            :alt="a.name"
            class="w-6 h-6"
          />
        </td>
        <td>
          <b>#{{ a.rank }}</b>
        </td>
        <td>
          <router-link
            class="hover:underline hover:text-green-800 text-green-600"
            :to="{ name: 'coindetail', params: { id: a.id } }"
          >
            {{ a.name }}
          </router-link>
          <small class="ml-1 text-gray-500">
            {{ a.symbol }}
          </small>
        </td>
        <td>
          {{ dollar(a.priceUsd) }}
        </td>
        <td>
          {{ dollar(a.marketCapUsd) }}
        </td>
        <td
          :class="`${
            !a.changePercent24Hr.includes('-')
              ? 'text-green-600'
              : 'text-red-600'
          } font-bold`"
        >
          {{ percent(a.changePercent24Hr) }}
        </td>
        <td class="hidden sm:block">
          <px-button v-on:custom-click="goToCoin(a.id)">
            <template v-slot:button_text>
              <span>Detalle</span>
            </template>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { dollarFilter, percentFilter } from "@/filters";
import PxButton from "@/components/PxButton.vue";

export default {
  name: "PxAssetsTable",
  data: () => {
    return {
      filter: "",
      sortOrder: 1,
    };
  },
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    filteredAssets: function () {
      return this.assets
        .filter(
          (a) =>
            a.name.toLowerCase().includes(this.filter) ||
            a.symbol.toLowerCase().includes(this.filter)
        )
        .sort((a, b) => {
          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder;
          }
          return this.sortOrder * -1;
        });
    },
  },
  methods: {
    changeSortOrder: function () {
      this.sortOrder = this.sortOrder * -1;
    },
    dollar: function (value) {
      return dollarFilter(value);
    },
    percent: function (value) {
      return percentFilter(value);
    },
    goToCoin: function (id) {
      this.$router.push({
        name: "coindetail",
        params: {
          id: id,
        },
      });
    },
  },
  components: {
    PxButton,
  },
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
