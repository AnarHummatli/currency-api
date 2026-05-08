let allButtons = document.querySelectorAll(".currencies button");
let firstInput = document.querySelector(".first-input");
let secondInput = document.querySelector(".second-input");
let buyText = document.querySelector(".buy-text");
let sellText = document.querySelector(".sell-text");
let firstExcInfo = document.querySelector(".first-exchange-info");
let secondExcInfo = document.querySelector(".second-exchange-info");

let base = 'RUB';
let symbols = 'USD';
const apiKey = "o4YTyJTSyZqQLfM7MPjUcbM4EBwsXR5s";

let currentCoefficient = 1;
let selectedBank = "NEW";



function formatNumber(num) {
    return parseFloat(num.toFixed(4));
}

function allowOnlyNumbers(value) {
    return value.replace(/[^0-9.]/g, '');
}

function formatInput(value) {
    value = value.replace(',', '.');

    if (value === '.') {
        value = '0.';
    }

    if (value === '') {
        value = '0';
    }

    if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
        value = value.slice(1);
    }

    let parts = value.split('.');

    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
        parts = value.split('.');
    }

    if (parts.length === 2) {
        if (parts[1].length > 4) {
            parts[1] = parts[1].slice(0, 4);
        }
        value = parts.join('.');
    }

    if (Number(value) > 10000) {
        value = "10000";
    }

    return value;
}

function updateRates() {
    if (base === symbols) {
        currentCoefficient = 1;
        calculateFromFirst();
        changeText(base, symbols);
        return;
    }

    const url = `https://api.currencybeacon.com/v1/latest?api_key=${apiKey}&base=${base}&symbols=${symbols}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            currentCoefficient = data.response.rates[symbols];
            calculateFromFirst();
            changeText(base, symbols);
        });
}

function calculateFromFirst() {
    let amount = Number(firstInput.value);

    if (!isNaN(amount)) {

        if (amount === 0) {
            secondInput.value = "0";
            buyText.innerText = "0";
            sellText.innerText = "0";
            return;
        }

        secondInput.value = formatNumber(amount * currentCoefficient);
        calculateBank(selectedBank);
    }
}

function calculateFromSecond() {
    let amount = Number(secondInput.value);

    if (!isNaN(amount)) {

        if (amount === 0) {
            firstInput.value = "0";
            buyText.innerText = "0";
            sellText.innerText = "0";
            return;
        }

        firstInput.value = formatNumber(amount / currentCoefficient);
        calculateBank(selectedBank);
    }
}

function calculateBank(bank) {
    selectedBank = bank;

    let val = Number(secondInput.value);

    if (base === symbols) {
        buyText.innerText = formatNumber(val);
        sellText.innerText = formatNumber(val);
        return;
    }

    if (bank === "ABC") {
        buyText.innerText = formatNumber(val * 1.01);
        sellText.innerText = formatNumber(val * 0.995);
    }
    else if (bank === "NEW") {
        buyText.innerText = formatNumber(val * 1.02);
        sellText.innerText = formatNumber(val * 0.99);
    }
    else if (bank === "AME") {
        buyText.innerText = formatNumber(val * 1.015);
        sellText.innerText = formatNumber(val * 0.985);
    }
    else if (bank === "RED") {
        buyText.innerText = formatNumber(val * 1.005);
        sellText.innerText = formatNumber(val * 0.995);
    }
}

function changeText(base, symbols) {
    if (base === symbols) {
        firstExcInfo.innerText = `1 ${base} = 1 ${symbols}`;
        secondExcInfo.innerText = `1 ${symbols} = 1 ${base}`;
        return;
    }
    
    firstExcInfo.innerText = `1 ${base} = ${formatNumber(currentCoefficient)} ${symbols}`;
    let newCoefficient = 1 / currentCoefficient;
    secondExcInfo.innerText = `1 ${symbols} = ${formatNumber(newCoefficient)} ${base}`;
}



firstInput.addEventListener('input', (e) => {
    let value = allowOnlyNumbers(e.target.value);
    value = formatInput(value);
    e.target.value = value;
    calculateFromFirst();
});

secondInput.addEventListener('input', (e) => {
    let value = allowOnlyNumbers(e.target.value);
    value = formatInput(value);
    e.target.value = value;
    calculateFromSecond();
});

allButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {

        let clickedButton = e.target;
        let parentContainer = clickedButton.closest(".currencies");
        let currentActive = parentContainer.querySelector(".active");
        let parentDiv = parentContainer.closest(".change");

        if (currentActive) {
            currentActive.classList.remove("active");
        }
        clickedButton.classList.add("active");

        if (parentDiv.classList.contains("first-change")) {
            base = clickedButton.innerText;
            updateRates();
        }
        else if (parentDiv.classList.contains("second-change")) {
            symbols = clickedButton.innerText;
            updateRates();
        }
        else if (parentDiv.classList.contains("third-change")) {
            calculateBank(clickedButton.innerText);
        }
    });
});

updateRates();