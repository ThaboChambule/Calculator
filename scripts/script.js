/*let value1 = "";

let operation = "";

let value2 = "";
*/
//better to use a single expression

let expression = ""; 
const display = document.querySelector(".js-display"); //Bottom screen result
const historyDisplay = document.querySelector(".js-history"); // Top screen expression

//Event listeners for all buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    
  
    if (display.value.includes("Error") || display.value === "Infinity" || display.value === "NaN") {
      
      if (display.value === "Syntax Error") {
        
      } else {
         clearCalculator();
      }
    
      if (!value || ["+", "-", "x", "÷", "^", "%", ")"].includes(value)) {
        return; 
      }
    }

    if (button.classList.contains("clear")) {
      clearCalculator();
      return;
    }

    if (value === "DEL") {
      deleteLastInput();
      return;
    }

    if (button.classList.contains("equal")) {
      calculateResult();
      return;
    }

    if (["sin", "cos", "tan", "log", "ln", "√"].includes(value)) {
      appendFunction(value);
      return;
    }

    if (value === "inv") {
      appendInput("1");
      appendInput("÷");
      return;
    }

    if (value) {
      appendInput(value);
    }
  });
});


function appendInput(value) {
  const lastChar = expression.slice(-1);
  const isNumber = (char) => /[0-9]/.test(char);
  const isOperator = ["+", "-", "x", "÷", "^", "%"].includes(value);
  const lastIsOperator = ["+", "-", "x", "÷", "^", "%"].includes(lastChar);

  // This prevents multiple decimals in the current number
  if (value === ".") {
    const parts = expression.split(/[\+\-\x\÷\^\%\(\)]/);
    const currentNumber = parts[parts.length - 1];
    if (currentNumber.includes(".")) return;
  }

  //This prevents starting with an operator (except minus)
  if (expression === "" && isOperator && value !== "-") return;

  // This throws an Error on Double Operators
  if (isOperator && lastIsOperator) {
    display.value = "Syntax Error";
    return;
  }


  if (lastChar === "(" && isOperator && value !== "-") {
    display.value = "Syntax Error";
    return;
  }

  if (["π", "e", "("].includes(value)) {
    if (isNumber(lastChar) || lastChar === ")" || ["π", "e"].includes(lastChar)) {
      expression += "x";
    }
  }

  if (isNumber(value) || value === ".") {
    if (lastChar === ")" || ["π", "e"].includes(lastChar)) {
      expression += "x";
    }
  }

  expression += value;
  updateScreens();
}


function appendFunction(func) {
  const lastChar = expression.slice(-1);
  const isNumber = (char) => /[0-9]/.test(char);

  //This takes into account Implicit multiplication for example "5sin(" becomes "5xsin("
  if (isNumber(lastChar) || lastChar === ")" || ["π", "e"].includes(lastChar)) {
    expression += "x";
  }
  expression += func + "(";
  updateScreens();
}


function updateScreens() {
  historyDisplay.textContent = expression;
  
 
  const lastChar = expression.slice(-1);
  if (expression && !["+", "-", "x", "÷", "^", "%", "("].includes(lastChar)) {
    calculatePreview();
  } else if (expression === "") {
    display.value = "0";
  }
}

function isOperator(char) {
  return ["+", "-", "x", "÷", "^", "%", "("].includes(char);
}

// 
function clearCalculator() {
  expression = "";
  historyDisplay.textContent = "";
  display.value = "0";
}

function deleteLastInput() {
  if (expression === "") return;
  
  const funcs = ["sin(", "cos(", "tan(", "log(", "ln(", "sqrt("]; 

  
  if (expression.endsWith("sin(")) expression = expression.slice(0, -4);
  else if (expression.endsWith("cos(")) expression = expression.slice(0, -4);
  else if (expression.endsWith("tan(")) expression = expression.slice(0, -4);
  else if (expression.endsWith("log(")) expression = expression.slice(0, -4);
  else if (expression.endsWith("ln(")) expression = expression.slice(0, -3); // ln is 2 chars + (
  else if (expression.endsWith("√(")) expression = expression.slice(0, -2);
  else expression = expression.slice(0, -1);

  updateScreens();
}


function calculatePreview() {
  try {
    let mathString = sanitizeExpression(expression);
    
    if ((mathString.match(/\(/g) || []).length !== (mathString.match(/\)/g) || []).length) return;
    
    const result = evaluateMath(mathString);
    
    if (isFinite(result) && !isNaN(result)) {
      const finalResult = Math.round(result * 1000000000) / 1000000000;
      display.value = finalResult.toString();
    }
  } catch (error) {
    
  }
}

// 8. Calculate Result
function calculateResult() {
  if (!expression) return;

  try {
    let mathString = sanitizeExpression(expression);

    const openBrackets = (mathString.match(/\(/g) || []).length;
    const closeBrackets = (mathString.match(/\)/g) || []).length;
    if (openBrackets > closeBrackets) {
      mathString += ")".repeat(openBrackets - closeBrackets);
    }

    const result = evaluateMath(mathString);

    if (!isFinite(result)) throw new Error("Infinity");
    if (isNaN(result)) throw new Error("Math Error");

    const finalResult = Math.round(result * 1000000000) / 1000000000;
    
    historyDisplay.textContent = expression + " =";
    expression = finalResult.toString();
    display.value = expression;

  } catch (error) {
    display.value = error.message || "Error";
    expression = "";
  }
}

//standard javascript uses radians so this function will treat radians as degrees
//it also error handles
function evaluateMath(mathString) {
  const helpers = `
    function dSin(d) { return Math.sin(d * Math.PI / 180); }
    function dCos(d) { return Math.cos(d * Math.PI / 180); }
    function dTan(d) { 
      if ((d % 180) === 90 || (d % 180) === -90) throw new Error("Math Error");
      return Math.tan(d * Math.PI / 180); 
    }
    function dLog(x) { if(x<=0) throw new Error("Domain Error"); return Math.log10(x); }
    function dLn(x) { if(x<=0) throw new Error("Domain Error"); return Math.log(x); }
    function dSqrt(x) { if(x<0) throw new Error("Imaginary Error"); return Math.sqrt(x); }
  `;

  const safeMath = new Function(helpers + 'return ' + mathString);
  return safeMath();
}


function sanitizeExpression(expr) {
  return expr
    .replace(/x/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100")
    .replace(/π/g, Math.PI)
    .replace(/e/g, Math.E)
    .replace(/sin\(/g, "dSin(")
    .replace(/cos\(/g, "dCos(")
    .replace(/tan\(/g, "dTan(")
    .replace(/log\(/g, "dLog(")
    .replace(/ln\(/g, "dLn(")
    .replace(/√\(/g, "dSqrt(");
}

