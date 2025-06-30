const keypad = document.querySelector(".keypad");
const displayEl = document.querySelector(".display__result");
const displayExp = document.querySelector(".display__expression");

const STATES = {
  OPERAND_1: "ENTER_FIRST_NUMBER",
  OPERAND_2: "ENTER_SECOND_NUMBER",
  OPERATOR: "ENTER_OPERATOR",
  EQUALS: "ENTER EQUALS",
};

let currentState = STATES.OPERAND_1;

let operand1;
let operand2;
let operator;

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

function operate(a, b, oper) {
  
}

function setOperands(num) {
  if (currentState === STATES.OPERAND_1) {
      console.log(currentState);
      operand1 = num;   
      displayValue(operand1);
  }

  if (currentState === STATES.OPERATOR) {
    currentState = STATES.OPERAND_2;
    console.log(currentState);
    operand2 = num;
    
    // if (currentState === STATES.OPERAND_2) {
    //   operand2 = Number(String(operand2) + String(num));
    // }

    displayValue(operand2);
  }
}

function setOperator(value) {
  currentState = STATES.OPERATOR;
  console.log(currentState);
  // if (currentState === STATES.OPERATOR && value !== "=") {
  //   if (!operator) {
  //     operator = value;
  //     displayValue(operator);
  //     // displayEl.textContent += operator;
  //   } else {
  //     displayEl.textContent = displayEl.textContent.replace(operator, value);
  //     operator = value;
  //   }
  // }
  // displayValue(operator);

  if (currentState === STATES.OPERAND_2 && value === "=") {
    currentState = STATES.EQUALS;
  }

  if (currentState === STATES.OPERATOR) operator = value;
  displayValue(operator);
}

function displayValue(value) {
  if (typeof value !== "string") displayEl.textContent = displayEl.textContent.concat(String(value));
  displayEl.textContent.concat(value);

}

function handleUserInput(e) {
  const dataTypeAttr = e.target.getAttribute("data-type");
  const dataValueAttr = e.target.getAttribute("data-value");

  if (!dataValueAttr || !dataTypeAttr) return;

  let isNum = dataTypeAttr === "operand";
  let isOperator = dataTypeAttr === "operator";
  let isEquals = dataTypeAttr === "operator" && dataValueAttr === "=";
  let isDot = dataTypeAttr === "dot";
  let isAction = dataTypeAttr === "action";

  if (isNum) setOperands(Number(dataValueAttr));
  if (isOperator) setOperator(dataValueAttr);
  // if (isEquals) operate()
}

keypad.addEventListener("click", handleUserInput);
