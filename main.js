const keypad = document.querySelector(".keypad");
const displayEl = document.querySelector(".display__result");
const displayExp = document.querySelector(".display__expression");

const STATES = {
  OPERAND_1: "ENTERING_FIRST_NUMBER",
  OPERAND_2: "ENTERING_SECOND_NUMBER",
  OPERATOR: "ENTERING_OPERATOR",
  EQUALS: "PRESSED_EQUALS",
};

let currentState = STATES.OPERAND_1;
let signChanged = false;

let operand1;
let operand2;
let operator;
let result;

function operate(a, b, operator) {
  if (currentState === STATES.EQUALS) {
    switch (operator) {
      case "+":
        result = add(a, b);
        break;
      case "-":
        result = subtract(a, b);
        break;
      case "*":
        result = multiply(a, b);
        break;
      case "/":
        result = divide(a, b);
        break;
    }

    let strA;
    let strB;
    (a < 0) ? strA = `(${a})` : strA = "" + a;
    (b < 0) ? strB = `(${b})` : strB= "" + b;
    displayValue(strA + operator + strB);


    currentState = STATES.OPERAND_1;
  }

  operand1 = undefined;
  operand2 = undefined;
}

function setOperands(num) {
  if (result) {
    clearAll();
    result = undefined
  }

  if (currentState === STATES.OPERAND_1) {
    if (operand1 === undefined) {
      operand1 = "" + num;
    } else {
      operand1 += String(num);
    }
    operand1 = Number(operand1);
  }


  if (currentState === STATES.OPERATOR) {
    operand2 = "" + num;
    currentState = STATES.OPERAND_2;
    operand2 = Number(operand2);

  } else if (currentState === STATES.OPERAND_2) {
    operand2 += String(num);
    operand2 = Number(operand2);
  }

  displayValue(num);
}

function setOperator(value) {
  if (result && result !== "Error") {
    clearAll();
    operand1 = result;
    result = undefined;
    displayValue(operand1);
  }

  if (currentState === STATES.OPERAND_1 && typeof operand1 === "string" && operand1.endsWith(".")) {
    operand1 = Number(operand1.slice(0, -1));
    displayEl.textContent = displayEl.textContent.slice(0, -1);
  }

  if (currentState === STATES.OPERAND_1 && operand1 !== undefined) {
    currentState = STATES.OPERATOR;
  }

  if (currentState === STATES.OPERATOR) {
    operator = value;
    displayValue(operator);
  }
}

function displayValue(value) {
  if (currentState === STATES.OPERAND_1) {
    if (value < 0) {
      value = `(${value})`;
      displayEl.textContent = value;
    } else if (/[()\-]/g.test(displayEl.textContent)) {
      displayEl.textContent = displayEl.textContent.replace(/[()\-\s]/g, "");
    } else {
      displayEl.textContent += value;
    }
  }

  if (currentState === STATES.OPERAND_2) {
    if (value < 0) {
      displayEl.textContent = displayEl.textContent.slice(0, -(String(value).length - 1));
      value = `(${value})`;
      displayEl.textContent += value;
    } else if (displayEl.textContent.endsWith(")")) {
      displayEl.textContent = displayEl.textContent.slice(0, -(String(value).length - 3));
      displayEl.textContent += value;
    } else {
      displayEl.textContent += value;
    }
  }

  if (currentState === STATES.OPERATOR) {
    let hasOperatorInDisplay = /[+\-*/]/.test(displayEl.textContent);
    if (hasOperatorInDisplay && !displayEl.textContent.endsWith((")"))) {
      displayEl.textContent = displayEl.textContent.slice(0, -1) + value;
    } else {
      displayEl.textContent += value;
    }
  }

  if (currentState === STATES.EQUALS) {
    displayExp.textContent += value;
    displayEl.textContent = "" + result;
  }
}

function setFloatingPoint() {
  if (result) {
    clearAll();
    result = undefined
  }
  if (currentState === STATES.OPERAND_1) {
    if (signChanged) return;
    if (operand1 === undefined) {
      operand1 = "0.";
      displayValue(operand1);
    } else if (!String(operand1).includes(".")) {
      operand1 = String(operand1) + ".";
      displayValue(".");
    }

  } else if (currentState === STATES.OPERAND_2) {
      if (signChanged) return;
      if (!String(operand2).includes(".")) {
        operand2 = String(operand2) + ".";
        displayValue(".")
      }
  }
  signChanged = false;
}

function handleEquals(value) {
  if (currentState === STATES.OPERAND_2 && typeof operand2 === "string" && operand2.endsWith(".")) {
    operand2 = Number(operand2.slice(0, -1));
    displayEl.textContent = displayEl.textContent.slice(0, -1);
  }

  if (currentState === STATES.OPERAND_2) {
    currentState = STATES.EQUALS;
    operate(operand1, operand2, operator);
  }
}


function handleUserInput(e) {
  const dataTypeAttr = e.target.getAttribute("data-type");
  const dataValueAttr = e.target.getAttribute("data-value");

  if (!dataValueAttr || !dataTypeAttr) return;

  let isNum = dataTypeAttr === "operand";
  let isOperator = dataTypeAttr === "operator" && dataValueAttr !== "=";
  let isEquals = dataTypeAttr === "operator" && dataValueAttr === "=";
  let isFloatingPoint = dataTypeAttr === "floating-point";
  let isAction = dataTypeAttr === "action";

  if (isNum) setOperands(Number(dataValueAttr));
  if (isOperator) setOperator(dataValueAttr);
  if (isEquals) handleEquals(dataValueAttr);
  if (isAction && dataValueAttr === "clear") clearAll();

  if (isFloatingPoint) setFloatingPoint();
  if (isAction && dataValueAttr === "undo") undo();

  if (isAction && dataValueAttr === "sign") {
    if (result) {
      clearAll();
      operand1 = result;
      result = undefined;
    }

    if (currentState === STATES.OPERAND_1 && operand1 !== undefined) {
      operand1 = changeSign(operand1);
      signChanged = true;
      displayValue(operand1);
    } else if (currentState === STATES.OPERAND_2 && operand2 !== undefined) {
      operand2 = changeSign(operand2);
      signChanged = true;
      displayValue(operand2);
    }
  }
}

keypad.addEventListener("click", handleUserInput);

function clearAll() {
  displayEl.textContent = "";
  displayExp.textContent = "";
  operand1 = undefined;
  operand2 = undefined;
  operator = undefined;
  signChanged = false;
  currentState = STATES.OPERAND_1;
  console.clear(); // DELETE
}

function changeSign(num) {
  return -num;
}

function undo() {
  if (result) {
    clearAll();
    return;
  }

  switch (currentState) {
    case STATES.OPERAND_1:
      operand1 = Number(operand1.toString().slice(0, -1));
      displayEl.textContent = displayEl.textContent.slice(0, -1);
      break;
    case STATES.OPERATOR:
      operator = undefined;
      displayEl.textContent = displayEl.textContent.slice(0, -1);
      break;
    case STATES.OPERAND_2:
      operand2 = Number(operand2.toString().slice(0, -1));
      displayEl.textContent = displayEl.textContent.slice(0, -1);
      break;
  }
}

function add(a, b) {
  let result = a + b;
  if (!Number.isInteger(result)) return roundDecimal(result);
  return result;
}

function subtract(a, b) {
  let result = a - b;
  if (!Number.isInteger(result)) return roundDecimal(result);
  return result;
}

function multiply(a, b) {
  let result = a * b;
  if (!Number.isInteger(result)) return roundDecimal(result);
  return result;
}

function divide(a, b) {
  if (b === 0) return "Error";
  let result = a / b;
  if (!Number.isInteger(result)) return roundDecimal(result);
  return result;
}

function roundDecimal(num) {
  const decimalsLength = num.toString().split(".")[1].length;
  return (decimalsLength > 6) ? Number(parseFloat(num.toFixed(6))) : num;
}