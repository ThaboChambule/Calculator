// 1. State Variables
let expression = ""; // Stores the math string like "5+5"
const display = document.querySelector(".js-display");

// 2. Add Event Listeners to ALL buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    
    // Handle Clear
    if (button.classList.contains("clear")) {
      clearCalculator();
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
    updateDisplay(expression);
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
  updateDisplay(expression);
}

// 4. Update Display
function updateDisplay(text) {
  // If empty, show 0. If error, show Error.
  display.value = text || "0";
  // Auto-scroll to the end of long numbers
  display.scrollLeft = display.scrollWidth;
}

// 5. Clear Calculator
function clearCalculator() {
  expression = "";
  updateDisplay("0");
}

// 6. Handle Scientific Math (Immediate Calculation)
function handleScientific(func) {
  // First, calculate any pending expression (e.g. "5+5" -> 10)
  calculateResult(); 
  
  // Get the current result as a number
  let currentVal = parseFloat(expression) || 0;
  let result = 0;

  switch (func) {
    case "sin": result = Math.sin(currentVal * Math.PI / 180); break; // Degrees
    case "cos": result = Math.cos(currentVal * Math.PI / 180); break;
    case "tan": result = Math.tan(currentVal * Math.PI / 180); break;
    case "log": result = Math.log10(currentVal); break;
    case "ln":  result = Math.log(currentVal); break;
    case "√":   
      if(currentVal < 0) { updateDisplay("Error"); expression=""; return; }
      result = Math.sqrt(currentVal); 
      break;
    case "inv": result = 1 / currentVal; break;
  }

  // Limit decimals to prevent huge numbers
  result = parseFloat(result.toFixed(8));
  
  expression = result.toString();
  updateDisplay(expression);
}

// 7. Calculate Result (The Engine)
function calculateResult() {
  if (!expression) return;

  try {
    // Step A: Sanitize the string for JavaScript
    let mathString = expression
      .replace(/x/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")     // Power operator
      .replace(/%/g, "/100")    // Percentage
      .replace(/π/g, Math.PI)   // Pi
      .replace(/e/g, Math.E);   // Euler's number

    // Step B: Safe Calculation using Function constructor
    const safeMath = new Function('return ' + mathString);
    const result = safeMath();

    if (!isFinite(result) || isNaN(result)) {
      updateDisplay("Error");
      expression = "";
    } else {
      // Fix floating point precision (e.g. 0.1 + 0.2)
      const finalResult = Math.round(result * 1000000000) / 1000000000;
      expression = finalResult.toString();
      updateDisplay(expression);
    }
  } catch (error) {
    updateDisplay("Error");
    expression = "";
  }
}

