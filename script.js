const quickExg = {};


// could hold objects with {symbol: and rate:}
let globalCrypto = [];

// holds objects of name, symbol
quickExg.symbol = [];

quickExg.apiKey = 'c264a6564be08eac4e720222e86b3b61';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

// these solved the issue of the modal loading slowly
quickExg.start = $('.start');
quickExg.modal = $('.modalContainer');
quickExg.sell = $('.sell');
quickExg.dollarSell = $('.dollarSell');
quickExg.dropDown = $('.dropDown');


// when user clicks start on modal, fade out
quickExg.addStartButton = function () {
	this.start.on('click', function () {
		quickExg.modal.fadeOut('800');
	});
};

// get symbols for fiat and crypto
quickExg.symbolConverter = function (input) {
	let currentSymbol = '';
	// look at each ref(element) in symbol
	quickExg.symbol.forEach((element) => {
		if (input === element.name) {
			// use this symbol to get rates
			// if fiat, use for target(tg)
			// if crypto, use as reference towards third party fiat tg
			currentSymbol = element.symbol;
		}
		// console.log(currentSymbol);
	});
	return currentSymbol;
};

//getting "selection" from user to determine which currency string to use
quickExg.getInput = () => {
	//TODO another cache?? why cant we use 'this'??
	quickExg.dropDown.on('change', function () {
		// the selction variable holds that string val
		const selection = $(this).val();
		// pass that selection var into the listData
		const testing = quickExg.symbolConverter(selection);
		console.log(testing);
	});
};

// $.ajax({
// 	url: quickExg.apiList,
// 	method: 'GET',
// 	dataType: 'JSON',
// 	data: {
// 		access_key: quickExg.apiKey,
// 		target: input,
// 	},
// }).then((data) => {
// 	//
// });

//getting all currency objects and making an array out of the symbols
quickExg.populateOptions = () => {
	$.ajax({
		url: quickExg.apiList,
		method: 'GET',
		dataType: 'JSON',
		data: {
			access_key: quickExg.apiKey,
		},
	}).then((data) => {
		// FIAT
		const fiatCurrencies = data.fiat;
		globalFiat = fiatCurrencies;

		// holds fiat fullNames
		const fiatDisplay = [];

		for (const key in fiatCurrencies) {
			const fiatFullName = `${fiatCurrencies[key]} (${key})`;
			const fiatSymbol = key;
			fiatDisplay.push(`${fiatCurrencies[key]} (${key})`);

			const refFiat = {
				name: fiatFullName,
				symbol: fiatSymbol,
			};
			quickExg.symbol.push(refFiat);
		}

		// CRYPTO
		const cryptoCurrencies = data.crypto;
		const cryptoDisplay = [];
		for (let key in cryptoCurrencies) {
			// this gets us the individual currency objects
			const item = cryptoCurrencies[key];
			// for use in our display
			const fullName = item.name_full;

			// this sends into our symbol array
			const refCrypto = {
				name: fullName,
				symbol: item.symbol,
			};
			quickExg.symbol.push(refCrypto);
			cryptoDisplay.push(fullName);
		}

		const masterDisplay = fiatDisplay.concat(cryptoDisplay);
		quickExg.dropDownMenu(masterDisplay);
	});
};

//populate dropdown with symbols from populateOptions
quickExg.dropDownMenu = (currencyArray) => {
	currencyArray.forEach((currency) => {
		const result = $(`<option value='${currency}'>`).text(currency);
		$('.dropDown').append(result);
	});
};

// Creating function to calculate from user input to api output
quickExg.ratesData = (targetFiat, symbol) => {
	$.ajax({
		url: quickExg.apiLive,
		method: 'GET',
		dataType: 'JSON',
		data: {
			access_key: quickExg.apiKey,
			target: targetFiat,
		},
	}).then((data) => {
		const rates = data.rates;
		for (let key in rates) {
			if (key === symbol) {
			}
		}
	});
};
// this function gives us the rate of all crypto based on selected fiat
// use the symbol from the dropdown to get from sell >> buy

// Creating function to get input from user and display converted amount
quickExg.displayAmt = () => {
	// TODO $('#sell') >>> should be using "this.sell"???
	quickExg.sell.on('submit', function (e) {
		e.preventDefault();
		// $('.dollarBuy').attr('value', $('.dollarSell').val());
		//TODO cache
		const sellValue = quickExg.dollarSell.val();
	});
};

//INIT FUNCTION
quickExg.init = () => {
	quickExg.addStartButton();
	quickExg.getInput();
	// quickExg.symbolConverter();
	quickExg.populateOptions();
	quickExg.displayAmt();
	quickExg.ratesData();
};

//DOCUMENT READY FUNCTION
$(function () {
	quickExg.init();
});

// JQUERY CACHING *****

/*
// NATIONAL CURR -> CRYPTO
// Ajax call with target being the national curr
// Locate crypto curr in the object
// Multiply the rate with user entered quantity

// CRYPTO -> CRYPTO
// Ajax call with default live (USD)
// Locate both crypto objects and identify rates
// Multiply or divide the rates to get the crypto to crypto rate <---EXTRA STEP
// We multiply calculated crypto rate with user entered quantity
*/
