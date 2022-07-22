import numeral from "numeral";

const dollarChartFilter = function (value) {
  return numeral(numeral(value).format("0.00")).value();
};

const dollarFilter = function (value) {
  if (!value) {
    return "$ 0";
  }

  return numeral(value).format("$ 0.00 a");
};

const percentFilter = function (value) {
  if (!value) {
    return "0%";
  }

  return numeral(numeral(value).value() / 100).format("0.00%");
};

export { dollarFilter, percentFilter, dollarChartFilter };
