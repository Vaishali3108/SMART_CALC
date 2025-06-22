let currentInput = '';
let currentOperation = null;
let previousInput = '';
let shouldResetDisplay = false;
let memory = 0;
let isScientificMode = false;

const buttonSound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');

function appendValue(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
    playSound();
}

function clearDisplay() {
    currentInput = '';
    currentOperation = null;
    previousInput = '';
    updateDisplay();
    playSound();
}

function deleteLastInput() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
    playSound();
}

function calculate() {
    if (currentOperation === '' || currentInput === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (currentOperation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Cannot divide by zero!');
                return;
            }
            result = prev / current;
            break;
    }
    
    const calculation = `${previousInput} ${currentOperation} ${currentInput} = ${result}`;
    saveToHistory(calculation);
    
    currentInput = result.toString();
    currentOperation = '';
    previousInput = '';
    updateDisplay();
    playSound();
}

function setOperation(operation) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate();
    }
    currentOperation = operation;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
    playSound();
}

function updateDisplay() {
    const display = document.getElementById('display');
    if (currentOperation) {
        display.value = `${previousInput} ${currentOperation} ${currentInput}`;
    } else {
        display.value = currentInput;
    }
}

function playSound() {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(error => console.log('Error playing sound:', error));
}

function saveToHistory(calculation) {
    let history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
    history.unshift(calculation);
    if (history.length > 10) history.pop();
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
    document.getElementById('history-popup').style.display = 'block';
}

function toggleHistory() {
    const popup = document.getElementById('history-popup');
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
    } else {
        showHistory();
    }
}

function clearHistory() {
    localStorage.removeItem('calculatorHistory');
    document.getElementById('history-list').innerHTML = '';
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('calculatorMode', isLightMode ? 'light' : 'dark');
}

function toggleScientificMode() {
    isScientificMode = !isScientificMode;
    const scientificButtons = document.querySelector('.scientific-buttons');
    const modeBtn = document.querySelector('.mode-btn');
    
    if (isScientificMode) {
        scientificButtons.style.display = 'grid';
        modeBtn.textContent = 'Basic Mode';
    } else {
        scientificButtons.style.display = 'none';
        modeBtn.textContent = 'Scientific Mode';
    }
    playSound();
}

function memoryAdd() {
    const value = parseFloat(currentInput) || 0;
    memory += value;
    updateMemoryIndicator();
    playSound();
}

function memorySubtract() {
    const value = parseFloat(currentInput) || 0;
    memory -= value;
    updateMemoryIndicator();
    playSound();
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
    playSound();
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
    playSound();
}

function updateMemoryIndicator() {
    const indicator = document.getElementById('memory-indicator');
    indicator.style.opacity = memory !== 0 ? '1' : '0';
}

function calculatePercentage() {
    const value = parseFloat(currentInput);
    if (!isNaN(value)) {
        currentInput = (value / 100).toString();
        updateDisplay();
        playSound();
        saveToHistory(`${value}% = ${currentInput}`);
    }
}

// Scientific functions
function calculateSquareRoot() {
    const value = parseFloat(currentInput);
    if (value >= 0) {
        currentInput = Math.sqrt(value).toString();
        updateDisplay();
        playSound();
        saveToHistory(`√${value} = ${currentInput}`);
    } else {
        alert('Cannot calculate square root of negative number!');
    }
}

function calculateSquare() {
    const value = parseFloat(currentInput);
    currentInput = (value * value).toString();
    updateDisplay();
    playSound();
    saveToHistory(`${value}² = ${currentInput}`);
}

function calculatePower() {
    const value = parseFloat(currentInput);
    currentInput = (value * value).toString();
    updateDisplay();
    playSound();
    saveToHistory(`${value}^2 = ${currentInput}`);
}

function calculateLog() {
    const value = parseFloat(currentInput);
    if (value > 0) {
        currentInput = Math.log10(value).toString();
        updateDisplay();
        playSound();
        saveToHistory(`log(${value}) = ${currentInput}`);
    } else {
        alert('Cannot calculate logarithm of non-positive number!');
    }
}

function calculateSin() {
    const value = parseFloat(currentInput);
    currentInput = Math.sin(value * Math.PI / 180).toString();
    updateDisplay();
    playSound();
    saveToHistory(`sin(${value}°) = ${currentInput}`);
}

function calculateCos() {
    const value = parseFloat(currentInput);
    currentInput = Math.cos(value * Math.PI / 180).toString();
    updateDisplay();
    playSound();
    saveToHistory(`cos(${value}°) = ${currentInput}`);
}

function calculateTan() {
    const value = parseFloat(currentInput);
    currentInput = Math.tan(value * Math.PI / 180).toString();
    updateDisplay();
    playSound();
    saveToHistory(`tan(${value}°) = ${currentInput}`);
}

function insertPi() {
    currentInput = Math.PI.toString();
    updateDisplay();
    playSound();
}

function insertE() {
    currentInput = Math.E.toString();
    updateDisplay();
    playSound();
}

function calculateFactorial() {
    const value = parseInt(currentInput);
    if (value >= 0 && Number.isInteger(value)) {
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        currentInput = result.toString();
        updateDisplay();
        playSound();
        saveToHistory(`${value}! = ${currentInput}`);
    } else {
        alert('Please enter a non-negative integer!');
    }
}

function generateRandom() {
    currentInput = Math.random().toString();
    updateDisplay();
    playSound();
}

function insertParenthesis(paren) {
    currentInput += paren;
    updateDisplay();
    playSound();
}

// Initialize mode from localStorage
const savedMode = localStorage.getItem('calculatorMode');
if (savedMode === 'light') {
    document.body.classList.add('light-mode');
}

// Initialize display
updateDisplay();

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        appendValue(event.key);
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        const operationMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        setOperation(operationMap[event.key]);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLastInput();
    } else if (event.key === '%') {
        calculatePercentage();
    }
});

// Memory keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.altKey) {
        switch(event.key.toLowerCase()) {
            case 'm':
                memoryAdd();
                break;
            case 'n':
                memorySubtract();
                break;
            case 'r':
                memoryRecall();
                break;
            case 'c':
                memoryClear();
                break;
        }
    }
});
