const numberToWords = require('number-to-words');

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const formatDate = (d = new Date()) => {
  const date = new Date(d);
  const dd   = String(date.getDate()).padStart(2, '0');
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const toWords = (n) =>
  `${numberToWords.toWords(Math.round(n)).toUpperCase()} ONLY`;

module.exports = { formatCurrency, formatDate, toWords };
