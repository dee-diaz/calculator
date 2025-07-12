// Эти функции ничего не знают про калькулятор. Они тупо считают
// Это важно: чистые функции проще тестировать, проще расширять

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}


function roundDecimal(num) {
  const decimalsLength = num.toString().split(".")[1].length;
  return (decimalsLength > 6) ? Number(parseFloat(num.toFixed(6))) : num;
}

function strToNum(str) {
  return parseFloat(str);
}

export default {
  add,
  subtract,
  multiply,
  divide,
  roundDecimal,
  strToNum,
};