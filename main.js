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

function operate() {

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

    displayValue(num);
  }

  // if (currentState === STATES.OPERATOR) {
  //   currentState = STATES.OPERAND_2;
  //   console.log(currentState);
  //   operand2 = num;
  //
  //   // if (currentState === STATES.OPERAND_2) {
  //   //   operand2 = Number(String(operand2) + String(num));
  //   // }
  //
  //   displayValue(operand2);
  // }
}

function setOperator(value) {
  if (operand1 !== undefined) {
    currentState = STATES.OPERATOR;
  } else {
    return;
  }

  console.info(currentState); // helper
  // if (currentState === STATES.OPERAND_2 && value === "=") {
  //   currentState = STATES.EQUALS;
  // }

  if (currentState === STATES.OPERATOR) {
    operator = value;

    console.log("Operator: " + operator); // helper

    displayValue(operator);
  }
}

function displayValue(value) {
  displayEl.textContent += value

  console.log("Current text content: " + displayEl.textContent); // helper

  // if (typeof value === "number") {
  //   // displayEl.textContent = displayEl.textContent.concat(String(value));
  //   displayEl.textContent += String(value);
  // } else if(typeof value === "string") {
  //   displayEl.textContent += value;
  // }
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
}

keypad.addEventListener("click", handleUserInput);


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