// actually = to n-1
const arrayFrom1ToN = n => {
  return Array.from(Array(n).keys());
};

const randomElement = items => {
  return items[Math.floor(Math.random() * items.length)];
};

const mininumElement = (array, func) => {
  let minimum = array[0];
  array.forEach(el => {
    if (func(el) < func(minimum)) {
      minimum = el;
    }
  });
  return minimum;
};

const nonNullValues = elements => {
  return elements.filter(e => e);
};

const uniqueValues = elements => {
  return [...new Set(elements)];
};

/* eslint-disable no-extend-native, func-names */
Array.prototype.removeIfTrue = function(func) {
  this.forEach(el => {
    if (func(el)) {
      this.splice(this.indexOf(el, 1));
    }
  });
};

Array.prototype.removeElements = function(elements) {
  elements.forEach(el => {
    this.splice(this.indexOf(el), 1);
  });
};
/* eslint-enable no-extend-native, func-names */

const groupedArray = (arr, key) => {
  const dict = {};
  arr.forEach(s => {
    dict[s[key]] = dict[s[key]] || [];
    dict[s[key]].push(s);
  });
  return dict;
};

module.exports = {
  arrayFrom1ToN,
  randomElement,
  mininumElement,
  nonNullValues,
  uniqueValues,
  groupedArray
};
