let allButtons = document.querySelectorAll(".currencies button");
let firstInput = document.querySelector(".first-input");
let secondInput = document.querySelector(".second-input");
let buyText = document.querySelector(".buy-text");
let sellText = document.querySelector(".sell-text");

let base = 'RUB';
let symbols = 'USD';
const apiKey = "o4YTyJTSyZqQLfM7MPjUcbM4EBwsXR5s";

let currentCoefficient = 1;
let selectedBank = "NEW";



function updateRates() {
    const url = `https://api.currencybeacon.com/v1/latest?api_key=${apiKey}&base=${base}&symbols=${symbols}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            currentCoefficient = data.response.rates[symbols];
            calculateResult();
        })
}

function calculateResult() {
    let amount = Number(firstInput.value);
    if (!isNaN(amount)) {
        secondInput.value = (amount * currentCoefficient).toFixed(4);
        calculateBank(selectedBank);
    }
}

function calculateBank(bank) {
    selectedBank = bank;
    let val = Number(secondInput.value);

    if (bank === "ABC") {
        buyText.innerText = (val * 1.01).toFixed(4);
        sellText.innerText = (val * 0.995).toFixed(4);
    } else if (bank === "NEW") {
        buyText.innerText = (val * 1.02).toFixed(4);
        sellText.innerText = (val * 0.99).toFixed(4);
    } else if (bank === "AME") {
        buyText.innerText = (val * 1.015).toFixed(4);
        sellText.innerText = (val * 0.985).toFixed(4);
    } else if (bank === "RED") {
        buyText.innerText = (val * 1.005).toFixed(4);
        sellText.innerText = (val * 0.995).toFixed(4);
    }
}

firstInput.addEventListener('input', calculateResult);



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
        } else if (parentDiv.classList.contains("second-change")) {
            symbols = clickedButton.innerText;
            updateRates();
        } else if (parentDiv.classList.contains("third-change")) {
            calculateBank(clickedButton.innerText);
        }
    });
});

updateRates();