// Core Math Functions
function add(num1, num2) { return num1 + num2; }
function sub(num1, num2) { return num1 - num2; }
function prod(num1, num2) { return num1 * num2; }
function division(num1, num2) { 
    if (num2 === 0) return "Error"; // Prevent division by zero
    return num1 / num2; 
}

// Select DOM Elements
const display = document.querySelector(".display");

// Global State Variables
let firstValue = null;
let currentOperator = null;
let awaitingSecondValue = false;

// Number Buttons Event Listener
document.querySelectorAll(".number").forEach(element => {
    element.addEventListener("click", () => {
        const numPressed = element.innerText;

        // If an operator was just pressed, clear the display for the second number
        if (awaitingSecondValue) {
            display.innerText = numPressed;
            awaitingSecondValue = false;
        } else {
            // Append numbers, replacing the default "0"
            if (display.innerText === "0") {
                display.innerText = numPressed;
            } else {
                display.innerText += numPressed;
            }
        }
    });
});

// Operator Buttons Event Listener
document.querySelectorAll(".operator").forEach(element => {
    element.addEventListener("click", () => {
        // Store the first number and the chosen operator
        firstValue = parseFloat(display.innerText);
        currentOperator = element.innerText;
        display.innerText += ` ${currentOperator} `; 
        awaitingSecondValue = true; // Signals that the next number typed is the second value
    });
});

// Equal Button Event Listener
document.querySelector(".equal").addEventListener("click", () => {
    if (firstValue === null || currentOperator === null) return;

    const secondValue = parseFloat(display.innerText);
    let result = 0;

    switch (currentOperator) {
        case "+":
            result = add(firstValue, secondValue);
            break;
        case "-":
            result = sub(firstValue, secondValue);
            break;
        case "×":
            result = prod(firstValue, secondValue);
            break;
        case "÷":
            result = division(firstValue, secondValue);
            break;
        default:
            return;
    }

    display.innerText = result;
    
    // Reset state so you can chain operations or start fresh
    firstValue = null;
    currentOperator = null;
    awaitingSecondValue = false;
});

// Clear Button Event Listener
document.querySelector(".clear").addEventListener("click", () => {
    display.innerText = "0";
    firstValue = null;
    currentOperator = null;
    awaitingSecondValue = false;
});