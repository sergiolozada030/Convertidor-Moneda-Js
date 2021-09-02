const apiKey = 'cab85d3f6932cc2d779b4da2';
const dropList = document.querySelectorAll('form select'),
    fromCurrency = document.querySelector('.from select'),
    toCurrency = document.querySelector('.to select'),
    getButton = document.querySelector('form button');

for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        // Seleciona las dos monedas por defecto
        let selected = i == 0 ? (currency_code == 'USD' ? 'selected' : '') : currency_code == 'COP' ? 'selected' : '';
        // se crean las opciones
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // se insertan las monedas para mostrar en el html
        dropList[i].insertAdjacentHTML('beforeend', optionTag);
    }
    dropList[i].addEventListener('change', (e) => {
        loadFlag(e.target); // se llama la función para selecionar la bandera
    });
}

// función para mostrar la bandera segun la opción seleccionada
function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector('img');
            imgTag.src = `https://www.countryflags.io/${country_list[code]}/flat/48.png`;
        }
    }
}

window.addEventListener('load', () => {
    getExchangeRate();
});

getButton.addEventListener('click', (e) => {
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector('form .icon');
exchangeIcon.addEventListener('click', () => {
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate(); // calling getExchangeRate
});

function getExchangeRate() {
    const amount = document.querySelector('form input');
    const exchangeRateTxt = document.querySelector('form .exchange-rate');
    let amountVal = amount.value;
    // se valida el monto ingresado
    if (amountVal == '' || amountVal == '0') {
        amount.value = '1';
        amountVal = 1;
    }
    exchangeRateTxt.innerText = 'Getting exchange rate...';
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    // se consume el api que trae el valor de las monedas
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let exchangeRate = result.conversion_rates[toCurrency.value]; // valor de la moneda a convertir
            let totalExRate = (amountVal * exchangeRate).toFixed(3); // se hace la operación de coversión
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        })
        .catch(() => {
            // validación cuando no hay internet
            exchangeRateTxt.innerText = 'Something went wrong';
        });
}
