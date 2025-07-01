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
    const fullExpr = "" + a + operator + b
    displayValue(fullExpr);
    currentState = STATES.OPERAND_1;
  }
}

function setOperands(num) {
  if (currentState === STATES.OPERAND_1) {
    console.log("STATUS:" + currentState); // helper

    if (operand1 === undefined) {
      operand1 = "" + num;
    } else {
      operand1 += String(num);
    }
    operand1 = Number(operand1);

    console.log("Operand 1 = " + operand1, typeof operand1); // helper
  }



  if (currentState === STATES.OPERATOR) {
    operand2 = "" + num;
    currentState = STATES.OPERAND_2;
    operand2 = Number(operand2);

    console.log("Operand 2 = " + operand2, typeof operand2); // helper

  } else if (currentState === STATES.OPERAND_2) {
    operand2 += String(num);
    operand2 = Number(operand2);

    console.log("Operand 1 = " + operand1, typeof operand1); // helper
    console.log("Operand 2 = " + operand2, typeof operand2); // helper
  }

  displayValue(num);
}

function setOperator(value) {
  // Change state to ENTERING_OPERATOR if the first num is entered
  if (currentState === STATES.OPERAND_1 && operand1 !== undefined) {
    currentState = STATES.OPERATOR;
  } else {
    return;
  }

  console.info(currentState); // helper

  if (currentState === STATES.OPERATOR) {
    operator = value;
    displayValue(operator);

    console.log("Operator: " + operator); // helper
  }
}

function displayValue(value) {
  if (currentState === STATES.OPERAND_1 || currentState === STATES.OPERAND_2) {
    displayEl.textContent += value;
  }

  if (currentState === STATES.OPERATOR) {
    let hasOperatorInDisplay = /[+\-*/]/.test(displayEl.textContent);
    if (hasOperatorInDisplay) {
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

function handleEquals(value) {
  if (currentState === STATES.OPERAND_2) {
    currentState = STATES.EQUALS;
    console.log("STATUS: " + currentState); // helper
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
  let isDot = dataTypeAttr === "dot";
  let isAction = dataTypeAttr === "action";

  if (isNum) setOperands(Number(dataValueAttr));
  if (isOperator) setOperator(dataValueAttr);
  if (isEquals) handleEquals(dataValueAttr);
  if (isAction && dataValueAttr === "clear") {
    clearDisplay();
    resetValues();
  }
}

keypad.addEventListener("click", handleUserInput);

function clearDisplay() {
  displayEl.textContent = "";
  displayExp.textContent = "";
}

function resetValues() {
  operand1 = undefined;
  operand2 = undefined;
  operator = undefined;
  currentState = STATES.OPERAND_1;
}

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
  return a / b;
}