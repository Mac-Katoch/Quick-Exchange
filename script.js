const quickExg = {};
//TESTING UP DATED CODE ON GIT PUSH

// could hold objects with {symbol: and rate:}
// let globalCrypto = [];

// holds objects of name, symbol
quickExg.symbol = [];

// holds array of long names
quickExg.cryptoNamesArray = [];
quickExg.fiatNamesArray = [];

quickExg.apiKey = 'f92be607079263073b991b0fe5fa5e23';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

// these solved the issue of the modal loading slowly
quickExg.start = $('.start');
quickExg.modal = $('.modalContainer');

quickExg.sell = $('.mainDisplay');
quickExg.dollarSell = $('.dollarSell');

quickExg.sellDropDown = $('.sellDropDown');
quickExg.buyDropDown = $('.buyDropDown');

// when user clicks start on modal, fade out
quickExg.addStartButton = function () {
	this.start.on('click', function () {
		quickExg.modal.fadeOut('800');
	});
};

// get symbols for fiat and crypto out of the full names generated from getInput
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
	});
	return currentSymbol;
};

// calculates from user input to api output, using symbol converter to get rate
quickExg.ratesData = async function (symbol, targetFiat = 'USD') {
	let value = 0;

	await $.ajax({
		url: quickExg.apiLive,
		method: 'GET',
		dataType: 'JSON',
		data: {
			access_key: quickExg.apiKey,
			target: targetFiat,
		},
	}).then((data) => {
		//use symbol to access number value at symbol key CRYPTO ONLY
		value = data.rates[symbol];
		// console.log(data);
	});
	// console.log(value); // works
	return value;
};

// get exact user dollar from user 'input .dollarSell' and on button submitBtn
quickExg.getUserAmount = function () {
	quickExg.sell.on('submit', async () => {
		// await e.preventDefault();
		// Get user selection for buy currency type
		const buyLongName = quickExg.buyDropDown.val();
		// console.log(buyLongName); // works

		const buySymbol = quickExg.symbolConverter(buyLongName);
		// console.log(buySymbol);

		const sellLongName = quickExg.sellDropDown.val();
		// console.log(sellLongName); // works

		const sellSymbol = quickExg.symbolConverter(sellLongName);
		// console.log(sellSymbol); // works
		
		if ($('.sellCheckbox').is(':checked')) {
			// crypto to crypto conversion if checked
			const rateBuy = await quickExg.ratesData(buySymbol);
			const rateSell = await quickExg.ratesData(sellSymbol);
			const cryptoToCrypto = rateSell / rateBuy;
			const userAmt = quickExg.dollarSell.val();
			const converted = () => {
				return userAmt * cryptoToCrypto;
			}
			$('.results').text(converted());
			// console.log(converted());
		} else {
			// fiat to crypto
			const rate = await quickExg.ratesData(buySymbol);
			const userAmt = quickExg.dollarSell.val();
			const converted = (exgRate) => {
			return userAmt / exgRate;
			}
		$('.results').text(converted(rate));

		}
		//show in the result box, the conversion from crpto sell to fiat buy
	});
	// console.log(userAmt);
};

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
		// const fiatDisplay = [];

		for (const key in fiatCurrencies) {
			const fiatFullName = `${fiatCurrencies[key]} (${key})`;
			const fiatSymbol = key;
			quickExg.fiatNamesArray.push(`${fiatCurrencies[key]} (${key})`);

			const refFiat = {
				name: fiatFullName,
				symbol: fiatSymbol,
			};
			quickExg.symbol.push(refFiat);
		}

		// CRYPTO
		const cryptoCurrencies = data.crypto;
		// const cryptoDisplay = [];
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
			quickExg.cryptoNamesArray.push(fullName);
		}

		// TODO Find a better way to call this function
		// Unlike sell
		quickExg.buyDropDownMenu(quickExg.cryptoNamesArray);
	});
};

//populate dropdown with symbols from populateOptions
quickExg.sellDropDownMenu = function () {

	$('.sellCheckbox').on('change', function () {
		quickExg.sellDropDown.empty();
		if ($(this).is(':checked')) {
			quickExg.cryptoNamesArray.forEach((currency) => {
				const result = $(`<option value='${currency}'>`).text(currency);
				//TODO populate both dropdowns
				quickExg.sellDropDown.append(result);
			});
		} else {
			quickExg.fiatNamesArray.forEach((currency) => {
				const result = $(`<option value='${currency}'>`).text(currency);
				//TODO populate both dropdowns
				quickExg.sellDropDown.append(result);
			});
		}
	});
};

//populate dropdown with symbols from populateOptions
quickExg.buyDropDownMenu = function (currencyArray) {
	// console.log('This started!');
	quickExg.cryptoNamesArray.forEach((currency) => {
		console.log('This started!');
		const result = $(`<option value='${currency}'>`).text(currency);
		//TODO populate both dropdowns
		quickExg.buyDropDown.append(result);
	});
};

// Creating function to get input from user and display converted amount
quickExg.displayAmt = () => {
	quickExg.sell.on('submit', function (e) {
		e.preventDefault();
		// $('.dollarBuy').attr('value', $('.dollarSell').val());
		const sellValue = quickExg.dollarSell.val();
	});
};

//INIT FUNCTION
quickExg.init = () => {
	quickExg.addStartButton();
	quickExg.sellDropDownMenu();
	// quickExg.buyDropDownMenu();
	quickExg.populateOptions();
	quickExg.displayAmt();
	quickExg.getUserAmount();
};

//DOCUMENT READY FUNCTION
$(function () {
	quickExg.init();
});

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
