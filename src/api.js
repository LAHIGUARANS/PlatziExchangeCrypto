import { Date } from "core-js";

const url = "https://api.coincap.io/v2";

async function getAssets() {
  return await fetch(`${url}/assets?limit=30`)
    .then((res) => res.json())
    .then((res) => res.data);
}

async function getAsset(coin) {
  return await fetch(`${url}/assets/${coin}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

async function getAssetHistory(coin) {
  const now = new Date();
  const end = now.getTime();
  const dateOffset = 24 * 60 * 60 * 1000 * 1;
  const start = end - dateOffset;
  return await fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  )
    .then((res) => res.json())
    .then((res) => res.data);
}

async function getMarkets(coin) {
  return await fetch(`${url}/assets/${coin}/markets?limit=5`)
    .then((res) => res.json())
    .then((res) => res.data);
}

async function getExchange(coin) {
  return await fetch(`${url}/exchanges/${coin}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange,
};
