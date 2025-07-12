import utils from "./components/utils.js";

const keypad = document.querySelector(".keypad");
const displayEl = document.querySelector(".display__result");
const displayExp = document.querySelector(".display__expression");

const STATE = {
  OPERAND_1: "OPERAND_1",
  OPERAND_2: "OPERAND_2",
  OPERATOR: "OPERATOR",
  RESULT: "RESULT",
};

const calculator = {
  state: STATE.OPERAND_1,
  operand1: "",
  operand2: "",
  operator: "",
  result: "",

  input: function (type, value) {
    if (type === "operand") {
      if (this.state === STATE.OPERATOR) this.state = STATE.OPERAND_2;
      this.appendOperand(value);
    }

    if (type === "operator") {
      if (value !== "=") {
        this.state = STATE.OPERATOR;
        this.operator = value;
        console.log(this.operator);
      } else {
        this.state = STATE.RESULT;
        this.calculate(this.operand1, this.operand2, this.operator);
      }
    }

    if (type === "action") {
      if (value === "clear") this.clearAll();
    }

    if (type === "decimal-point") {
      this.setDecimalPoint();
    }
  },

  appendOperand: function (value) {
    if (this.state === STATE.OPERAND_1) {
      this.operand1 += value; // str
      console.log(this.operand1);
    } else if (this.state === STATE.OPERAND_2) {
      this.operand2 += value; // str
      console.log(this.operand2);
    }
  },

  calculate: function (a, b, operator) {
    a = utils.strToNum(a);
    b = utils.strToNum(b);

    switch (operator) {
      case "+":
        this.result = utils.add(a, b);
        break;
      case "-":
        this.result = utils.subtract(a, b);
        break;
      case "*":
        this.result = utils.multiply(a, b);
        break;
      case "/":
        this.result = utils.divide(a, b);
        break;
    }
    console.log(this.result);
  },

  clearAll: function () {
    this.operand1 = "";
    this.operand2 = "";
    this.operator = "";
    this.state = STATE.OPERAND_1;
    console.clear(); // DELETE IN PROD
  },

  setDecimalPoint: function () {
    if (this.state === STATE.OPERATOR) {
      this.state = STATE.OPERAND_2;
    }
    if (this.state === STATE.OPERAND_1) {
      this.handleDecimalFor("operand1");
    } else if (this.state === STATE.OPERAND_2) {
      this.handleDecimalFor("operand2");
    }
  },

  handleDecimalFor: function (operandKey) {
    if (!this[operandKey]) {
      this.appendOperand("0.");
    } else if (!this[operandKey].includes(".")) {
      this.appendOperand(".");
    }
  },
};

function handleUserInput(e) {
  const dataType = e.target.getAttribute("data-type");
  const dataValue = e.target.getAttribute("data-value");
  if (!dataValue || !dataType) return;
  calculator.input(dataType, dataValue);
}

keypad.addEventListener("click", handleUserInput);
