const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentNumber = "";
let previousNumber = "";
let operator = null;
let shouldResetDisplay = false;


// Number buttons
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});


// Operator buttons
document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});


// Clear button
document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


// Delete button
document
    .querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);


// Equal button
document
    .querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);


// Add number
function inputNumber(number) {

    if (shouldResetDisplay) {
        currentNumber = "";
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    // Prevent 0 at the beginning
    if (currentNumber === "0" && number !== ".") {
        currentNumber = "";
    }

    currentNumber += number;

    updateDisplay();
}


// Choose operator
function chooseOperator(selectedOperator) {

    if (currentNumber === "") {
        return;
    }

    if (operator !== null && previousNumber !== "") {
        calculate();
    }

    previousNumber = currentNumber;
    operator = selectedOperator;

    shouldResetDisplay = true;

    updateDisplay();
}


// Calculate result
function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operator === null
    ) {
        return;
    }

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operator = null;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        case "%": 
            result = firstNumber % secondNumber;
            break;
    }

    // Avoid very long decimal results
    result = parseFloat(result.toFixed(10));

    currentNumber = result.toString();
    previousNumber = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}


// Clear calculator
function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// Delete last number
function deleteNumber() {

    if (shouldResetDisplay || currentNumber === "Error") {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


// Update screen
function updateDisplay() {

    currentDisplay.textContent = currentNumber || "0";

    if (operator && previousNumber) {

        const operatorSymbol = {
            "+": "+",
            "-": "−",
            "*": "×",
            "/": "÷",
            "%": "%"
        };

        previousDisplay.textContent =
            `${previousNumber} ${operatorSymbol[operator]}`;

    } else {
        previousDisplay.textContent = "";
    }
}


document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        inputNumber(key);
    }

    // Operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {
        chooseOperator(key);
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "Escape" || key === "Delete") {
        clearCalculator();
    }
});