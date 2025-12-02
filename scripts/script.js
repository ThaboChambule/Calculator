// 1. State Variables
let expression = ""; 
const display = document.querySelector(".js-display"); // Bottom screen (Result)
const historyDisplay = document.querySelector(".js-history"); // Top screen (Expression)

// 2. Add Event Listeners to ALL buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    
    // Handle Clear
    if (button.classList.contains("clear")) {
      clearCalculator();
      return;
    }

    // Handle Delete (NEW)
    if (value === "DEL") {
      deleteLastInput();
      return;
    }

    // Handle Equal
    if (button.classList.contains("equal")) {
      calculateResult();
      return;
    }

    // Handle Scientific Functions (Immediate Action)
    // These calculate the result of the CURRENT number immediately
    if (["sin", "cos", "tan", "log", "ln", "√", "inv"].includes(value)) {
      handleScientific(value);
      return;
    }

    // Handle Standard Input (Numbers, Operators, Constants)
    if (value) {
      appendInput(value);
    }
  });
});

// 3. Append Input to Expression
function appendInput(value) {
  // (Keep your existing validation logic here)
  const lastChar = expression.slice(-1);
  const isNumber = (char) => /[0-9]/.test(char);
  const isOperator = ["+", "-", "x", "÷", "^", "%"].includes(value);
  const lastIsOperator = ["+", "-", "x", "÷", "^", "%"].includes(lastChar);

  // A. Prevent multiple decimals in the CURRENT number
  if (value === ".") {
    // Split by operators to get the last number segment (e.g. "5+3.2" -> "3.2")
    const parts = expression.split(/[\+\-\x\÷\^\%\(\)]/);
    const currentNumber = parts[parts.length - 1];
    if (currentNumber.includes(".")) return;
  }

  // B. Prevent starting with an operator (except minus for negative numbers)
  if (expression === "" && isOperator && value !== "-") return;

  // C. Prevent double operators (replace the last one)
  if (isOperator && lastIsOperator) {
    expression = expression.slice(0, -1) + value;
    updateScreens(); // Changed from updateDisplay
    return;
  }

  // D. Implicit Multiplication Logic
  // If user types "5π", "5e", "5(", or ")5", we need to add a multiplication sign
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
  updateScreens(); // Changed from updateDisplay
}

// 4. NEW: Update Both Screens
function updateScreens() {
  // Top Screen: Shows the full expression
  historyDisplay.textContent = expression;
  
  // Bottom Screen: Shows Live Preview
  // Only calculate if the expression is valid and has numbers
  if (expression && !isOperator(expression.slice(-1))) {
    calculatePreview();
  } else if (expression === "") {
    display.value = "0";
  }
}

function isOperator(char) {
  return ["+", "-", "x", "÷", "^", "%", "("].includes(char);
}

// 5. Clear Calculator
function clearCalculator() {
  expression = "";
  historyDisplay.textContent = "";
  display.value = "0";
}

// NEW: Delete Last Input
function deleteLastInput() {
  if (expression === "") return;
  expression = expression.slice(0, -1);
  updateScreens();
}

// 6. Handle Scientific Math
function handleScientific(func) {
  // Calculate current expression first to get a single number
  calculateResult(true); // Pass true to indicate "internal calculation"
  
  let currentVal = parseFloat(expression) || 0;
  let result = 0;

  switch (func) {
    case "sin": result = Math.sin(currentVal * Math.PI / 180); break;
    case "cos": result = Math.cos(currentVal * Math.PI / 180); break;
    case "tan": result = Math.tan(currentVal * Math.PI / 180); break;
    case "log": result = Math.log10(currentVal); break;
    case "ln":  result = Math.log(currentVal); break;
    case "√":   
      if(currentVal < 0) { display.value = "Error"; expression=""; return; }
      result = Math.sqrt(currentVal); 
      break;
    case "inv": result = 1 / currentVal; break;
  }

  result = parseFloat(result.toFixed(8));
  expression = result.toString();
  
  // Update screens after scientific op
  historyDisplay.textContent = func + "(" + currentVal + ")";
  display.value = expression;
}

// NEW: Calculate Preview (Live Result while typing)
function calculatePreview() {
  try {
    let mathString = sanitizeExpression(expression);
    const safeMath = new Function('return ' + mathString);
    const result = safeMath();
    
    if (isFinite(result) && !isNaN(result)) {
      const finalResult = Math.round(result * 1000000000) / 1000000000;
      display.value = finalResult.toString();
    }
  } catch (error) {
    // Don't show error on preview, just ignore
  }
}

// 7. Calculate Result (Final Equals)
function calculateResult(isInternal = false) {
  if (!expression) return;

  try {
    let mathString = sanitizeExpression(expression);
    const safeMath = new Function('return ' + mathString);
    const result = safeMath();

    if (!isFinite(result) || isNaN(result)) {
      display.value = "Error";
      expression = "";
    } else {
      const finalResult = Math.round(result * 1000000000) / 1000000000;
      
      if (!isInternal) {
        // If user pressed =, show "Expression =" on top
        historyDisplay.textContent = expression + " =";
      }
      
      expression = finalResult.toString();
      display.value = expression;
    }
  } catch (error) {
    display.value = "Error";
    expression = "";
  }
}

// Helper to clean string
function sanitizeExpression(expr) {
  return expr
    .replace(/x/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100")
    .replace(/π/g, Math.PI)
    .replace(/e/g, Math.E);
}

