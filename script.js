let submitBtn = document.getElementById("equals");
let clear = document.getElementById("clear");
let clearLast = document.getElementById("clearLast");
let currentInput = document.getElementById("display");
let input = document.getElementById("input");
let valuesArray = [];
let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");

// add event listeners to numbers
for (var i = 0; i < numbers.length; i++) {				
  let current = numbers[i];

  numbers[i].addEventListener("click", function() {
    let value = document.getElementById(current.id).value;

    if( !(input.value.slice(-1) === '/' && value === '0' ||  value === '.' && input.value.slice(-1) === '.' || value === '.' && currentInput.value.indexOf('.') > -1) ) {
      input.value = input.value + value;
      
      if(currentInput.value === '0' ) {
        currentInput.value = value;
      } else if( currentInput.value !== '/' && currentInput.value !== '*' && currentInput.value !== '+' && 			currentInput.value !== '-' ) {
        currentInput.value = currentInput.value + value;
      } else {
        valuesArray.push(currentInput.value);
        currentInput.value = value;
      }
    }
  });
}

// add event listeners to operators
for (var i = 0; i < operators.length; i++) {
  let current = operators[i];
  operators[i].addEventListener("click", function() {
    let value = document.getElementById(current.id).value;
    // An alternative approach to the problem of consecutive operators would be to simply not allow the user to enter them. 
    // Uncomment the "If" statement below in order to do this
    // if( input.value.slice(-1) !== '/' && input.value.slice(-1) !== '*' && input.value.slice(-1) !== '+' && input.value.slice(-1) !== '-' && input.value !== "") {
        valuesArray.push(currentInput.value);
        input.value = input.value + value;
        currentInput.value = value;
    // }
  });
}

submitBtn.addEventListener("click", calculate);
clear.addEventListener("click", clearValue);
clearLast.addEventListener("click", clearLastValue);

function calculate() {
  let stringInput = currentInput.value.toString();
  let regexp = /[*\-\+\/][*\-\+\/]/;
  let val;
  
  // First, use RegExp to test for consecutive operators
  if(regexp.test(valuesArray.join(""))) { 
    // ensure the first and last values entered were not operators
    if( input.value[0] !== '/' && input.value[0] !== '*' && input.value[0] !== '+' && input.value[0] !== '-' && 
      stringInput !== '/' && stringInput !== '*' && stringInput !== '+' && stringInput !== '-') {
      val = valuesArray[0] + valuesArray[valuesArray.length - 1] + stringInput;
      currentInput.value = eval(val);
      input.value = eval(val);
      // if the first value was an operator, but the last wasn't, then just use zero in place of the operator
    } else if(stringInput !== '/' && stringInput !== '*' && stringInput !== '+' && stringInput !== '-') {
      val = "0" + valuesArray[valuesArray.length - 1] + stringInput;
      currentInput.value = eval(val);
      input.value = eval(val);
      // if both first and last values were operators, then use a zero in place of both
    } else {
      val = "0" + valuesArray[valuesArray.length - 1] + "0";
      currentInput.value = 0;
      input.value = eval(val);
    }
  }
  
  // if no consecutive operators, then evaluate the simple mathematical expression, 
  // ensuring first that the last value entered wasn't an operator
  if( input.value.slice(-1) !== '/' && input.value.slice(-1) !== '*' && input.value.slice(-1) !== '+' && input.value.slice(-1) !== '-' && !/[*\-\+\/][*\-\+\/]/.test(valuesArray.join("")) ) {
    if(eval(input.value) !== undefined) {
      input.value = eval(input.value); 
      currentInput.value = eval(input.value);
    }	
  } 
  
  // reset the array of entered values
  valuesArray = [];
}

function clearValue() {
  input.value = "";
  currentInput.value = "";
  valuesArray = [];
  currentInput.value = "0";
}

function clearLastValue() {
  let value = input.value;
  let currentValue = currentInput.value;
  let numString = "";
  let char;

  if(currentValue === "0") {
    if(input.value !== "") {
      let inputEnd = input.value.substr(-1, 1);
      if(inputEnd === "*" || inputEnd === "/" || inputEnd === "+" || inputEnd === "-") {
        input.value = input.value.slice(0, -1);
        // grab all of the number characters after the last operator
        for(var i = -1; i >= -input.value.length; i--) {
          char = input.value.substr(i, 1);
          if (char === "*" || char === "/" || char === "+" || char === "-") { break; }
          numString = numString + char; 
        }
        // then chop them off
        input.value = input.value.slice(0, -numString.length);
      } 
    }
  } else if(currentValue !== "*" && currentValue !== "/" && currentValue !== "+" && currentValue !== "-") {
    let regexp = new RegExp(currentValue + "$");
    input.value = input.value.replace(regexp, "")
  } else {
    input.value = input.value.slice(0, -1);
    for(var i = -1; i >= -input.value.length; i--) {
      char = input.value.substr(i, 1);
      if (char === "*" || char === "/" || char === "+" || char === "-") { break; }
      numString = numString + char; 
    }
    input.value = input.value.slice(0, -numString.length);
  }

  currentInput.value = "0"; 
}