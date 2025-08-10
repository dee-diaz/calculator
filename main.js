import utils from "./components/utils.js";
import render from "./components/render.js"

const STATE = {
  OPERAND_1: "OPERAND_1",
  OPERAND_2: "OPERAND_2",
  OPERATOR: "OPERATOR",
  RESULT: "RESULT",
};

const keypad = document.querySelector(".keypad");

const calculator = {
  state: STATE.OPERAND_1,
  operand1: "",
  operand2: "",
  operator: "",
  result: "",

  input: function (type, value) {
    if (type === "operand" && this.result !== null) {
      if (this.state === STATE.OPERATOR) this.state = STATE.OPERAND_2;
      if (this.state === STATE.RESULT) this.clearAll();
      this.appendOperand(value);
    }

    if (type === "operator") {
      if (this.state === STATE.OPERAND_2 && value !== "=") return;
      if (this.state === STATE.OPERAND_1 && this.result) this.appendOperand(this.result);
      if (value !== "=") {
        if (this.state === STATE.RESULT) {
          const result = this.result;
          this.clearAll();
          this.appendOperand(result);
        }
        if (this.operand1 !== "") this.state = STATE.OPERATOR; //
        this.appendOperator(value);

      } else if(this.operand1 !== "" && this.operand2 !== "") {
        this.state = STATE.RESULT;
        this.calculate(this.operand1, this.operand2, this.operator);
      }
    }

    if (type === "action") {
      if (value === "clear") this.clearAll();
      if (value === "sign") this.changeOperandSign();
      if (value === "undo") this.undo();
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
    render.updateMainDisplay(value);
  },

  appendOperator: function(value) {
    if (this.operator !== "") render.displayUndo();

    if (this.state === STATE.OPERATOR) {
      this.operator = value;
      render.updateMainDisplay(this.operator);
    }
    console.log(this.operator);
  },


  changeOperandSign: function() {
    if (this.state === STATE.OPERAND_1 && this.operand1 !== "") {
      this.operand1 = utils.changeSign(this.operand1).toString();
      render.updateOperandSign(this.operand1);
      console.log(this.operand1);
    } else if (this.state === STATE.OPERAND_2 && this.operand2 !== "") {
      const expression = this.operand1 + this.operator;
      this.operand2 = utils.changeSign(this.operand2).toString();
      render.updateOperandSign(this.operand2, expression);
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

    if (typeof this.result === "number" && !Number.isInteger(this.result)) {
      const decimalsLength = this.result.toString().split(".")[1].length;
      if (decimalsLength > 6) this.result = utils.roundDecimal(this.result);
    }

    render.resetMainDisplay();
    render.updateMainDisplay(this.result);
    this.saveExpression(a, b, operator);
    console.log(this.result, this.state);
  },

  saveExpression: function(a, b, operator) {
    const formattedA = (a < 0) ? `(${a})` : a;
    const formattedB = (b < 0) ? `(${b})` : b;
    const expression = "" + formattedA + operator + formattedB;
    render.updateExpDisplay(expression);
  },

  undo: function() {
    if (this.state === STATE.RESULT) this.clearAll();

    switch (this.state) {
    case STATE.OPERAND_1:
      if (this.operand1.length > 0) this.operand1 = this.operand1.slice(0, -1);
      console.log(this.operand1, this.state);
      break;
    case STATE.OPERATOR:
      if (this.operator.slice(0, -1) === "") this.state = STATE.OPERAND_1;
      this.operator = "";
      console.log(this.operator, this.state);
      break;
    case STATE.OPERAND_2:
      if (this.operand2.slice(0, -1) === "") this.state = STATE.OPERATOR;
      if (this.operand2.length > 0) this.operand2 = this.operand2.slice(0, -1);
      console.log(this.operand2, this.state);
      break;
  }

    render.displayUndo();
  },

  clearAll: function () {
    this.operand1 = "";
    this.operand2 = "";
    this.operator = "";
    this.result = "";
    this.state = STATE.OPERAND_1;
    render.resetMainDisplay();
    render.resetExpressionDisplay();
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