let value1 = "";
let opp = "";
let value2 = "";

display();

function display(){
document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", (event) => {
    const number = parseInt(event.target.getAttribute("data-value"));
    const display = document.querySelector(".js-display");

    if(opp===""){
      value1 += number;
      display.value = value1;
    }
    else{
      value2 += number;
      display.value = value2;
    }



    display.value += number;
  });
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", (event) => {
    const opp = event.target.getAttribute("data-value");
  });
});

document.querySelector(".equal").addEventListener("click", () => {
  let result;
  switch (opp) {
    case "+":
      result = add(parseFloat(value1), parseFloat(value2));
      break;
    case "-":
      result = substract(parseFloat(value1), parseFloat(value2));
      break;
    case "x":
      result = multiply(parseFloat(value1), parseFloat(value2));
      break;
    case "÷":
      result = divide(parseFloat(value1), parseFloat(value2));
      break;
  }

  
  
  
});

}





function add(value1, value2) {
  return value1 + value2;
}
function substract(value1, value2) {
  return value1 - value2;
}

function multiply(value1, value2) {
  return value1 * value2;
}

function divide(value1, value2) {
  return value1 / value2;
}
