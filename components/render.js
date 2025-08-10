const displayEl = document.querySelector(".display__result");
const displayExp = document.querySelector(".display__expression");

function updateMainDisplay(value) {
  displayEl.textContent += value;
}

function updateExpDisplay(expression) {
  displayExp.textContent = expression;
}

function resetMainDisplay() {
  displayEl.textContent = "";
}

function resetExpressionDisplay() {
  displayExp.textContent = "";
}

function displayUndo() {
  displayEl.textContent = displayEl.textContent.slice(0, -1);
}


function updateOperandSign(operand, expression) {
  resetMainDisplay();
  const formatted = Number(operand) < 0 ? `(${operand})` : operand;
  updateMainDisplay(expression ? `${expression}${formatted}` : formatted);
}

export default {
  updateMainDisplay,
  updateExpDisplay,
  resetMainDisplay,
  resetExpressionDisplay,
  displayUndo,
  updateOperandSign,
};
