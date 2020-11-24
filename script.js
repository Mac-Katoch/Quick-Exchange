const quickExg = {};

quickExg.apiKey = 'f92be607079263073b991b0fe5fa5e23';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

quickExg.start = $('.start');
quickExg.modal = $('.modalContainer');

quickExg.sell = $('.mainDisplay');
quickExg.dollarSell = $('.dollarSell');

quickExg.sellDropDown = $('.sellDropDown');
quickExg.buyDropDown = $('.buyDropDown');

// holds objects of name, symbol
quickExg.symbol = [];

// holds array of long names
quickExg.cryptoNamesArray = [];
quickExg.fiatNamesArray = [];

quickExg.cryptoSwitch = $('label.crypto');
quickExg.fiatSwitch = $('label.fiat');
quickExg.selectedType = 'Fiat';

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
	});
	return value;
};

// get exact user dollar from user 'input .dollarSell' and on button submitBtn
quickExg.getUserAmount = function () {
	quickExg.sell.on('submit', async (e) => {
		e.preventDefault();
		// Get user selection for buy currency type
		const buyLongName = quickExg.buyDropDown.val();

		const buySymbol = quickExg.symbolConverter(buyLongName);

		const sellLongName = quickExg.sellDropDown.val();

		const sellSymbol = quickExg.symbolConverter(sellLongName);

		if (buySymbol && sellSymbol) {
			if (quickExg.selectedType === 'Crypto') {
				// crypto to crypto conversion if checked
				const rateBuy = await quickExg.ratesData(buySymbol);
				const rateSell = await quickExg.ratesData(sellSymbol);
				const cryptoToCrypto = rateSell / rateBuy;
				const userAmt = quickExg.dollarSell.val();
				const converted = () => {
					return userAmt * cryptoToCrypto;
				};
				$('.results').text(converted());
			} else {
				// fiat to crypto
				const rate = await quickExg.ratesData(buySymbol);
				const userAmt = quickExg.dollarSell.val();
				const converted = (exgRate) => {
					// Error handling to avoid 'Infinity' output
					if (exgRate === 0) {
						return 0;
					} else {
						return userAmt / exgRate;
					}
				};
				$('.results').text(converted(rate));
			}
		} else if (!buySymbol && sellSymbol) {
			swal({
				title: "Please pick a currency you're buying",
				button: 'Okay',
			});
		} else if (!sellSymbol && buySymbol) {
			swal({
				title: "Please pick a currency you're selling",
				button: 'Okay',
			});
		} else {
			swal({
				title: 'Please fill out form',
				button: 'Okay',
			});
		}
		//show in the result box, the conversion from crpto sell to fiat buy
	});
};

// TODO Changing Button Color
// quickExg.switchColor = () => {
// 	$("input[name='switch']").on('change', () => {
// 		// console.log(quickExg.selectedType);
// 		quickExg.cryptoSwitch.toggleClass('cryptoColor');
// 		quickExg.fiatSwitch.toggleClass('fiatColor');
// 	});
// };

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

		for (const key in fiatCurrencies) {
			const fiatSymbol = key;

			// build string value of name, sym
			const fiatFullName = `${fiatCurrencies[key]} (${fiatSymbol})`;

			// this is for the dropdown population
			quickExg.fiatNamesArray.push(fiatFullName);

			// this is for our conversion use
			const refFiat = {
				name: fiatFullName,
				symbol: fiatSymbol,
			};
			// send these objects to the quickExg.symbol
			quickExg.symbol.push(refFiat);
		}

		// CRYPTO
		const cryptoCurrencies = data.crypto;

		for (let key in cryptoCurrencies) {
			// this gets us the individual currency objects
			const item = cryptoCurrencies[key];
			// for use in our display
			const fullName = item.name_full;

			// this is for the dropdown population
			quickExg.cryptoNamesArray.push(fullName);

			// this sends into our symbol array
			const refCrypto = {
				name: fullName,
				symbol: item.symbol,
			};
			quickExg.symbol.push(refCrypto);
		}

		quickExg.buyDropDownMenu(quickExg.cryptoNamesArray);

		// makes default array crypto on left side.
		quickExg.fiatNamesArray.forEach((currency) => {
			const result = $(`<option value='${currency}'>`).text(currency);
			quickExg.sellDropDown.append(result);
		});
	});
};

//populate dropdown with symbols from populateOptions
quickExg.sellDropDownMenu = function () {
	$("input[name='switch']").on('change', function () {
		// getting value of radio button checked
		quickExg.selectedType = $("input[name='switch']:checked").val();
		// changing color based on whether crypto or fiat is selected
		quickExg.cryptoSwitch.toggleClass('cryptoColor');
		quickExg.fiatSwitch.toggleClass('fiatColor');

		// clearing amount value
		quickExg.dollarSell.value = '';

		quickExg.sellDropDown.empty();
		if (quickExg.selectedType === 'Crypto') {
			quickExg.cryptoNamesArray.forEach((currency) => {
				const result = $(`<option value='${currency}'>`).text(currency);
				quickExg.sellDropDown.append(result);
			});
		} else {
			quickExg.fiatNamesArray.forEach((currency) => {
				const result = $(`<option value='${currency}'>`).text(currency);
				quickExg.sellDropDown.append(result);
			});
		}
	});
};

//populate dropdown with symbols from populateOptions
quickExg.buyDropDownMenu = function () {
	quickExg.cryptoNamesArray.forEach((currency) => {
		const result = $(`<option value='${currency}'>`).text(currency);
		quickExg.buyDropDown.append(result);
	});
};

//INIT FUNCTION
quickExg.init = () => {
	// clearing amount value
	quickExg.dollarSell.val('');
	quickExg.addStartButton();
	quickExg.sellDropDownMenu();
	quickExg.populateOptions();
	// quickExg.displayAmt();
	quickExg.getUserAmount();
	// quickExg.switchColor();
};

//DOCUMENT READY FUNCTION
$(function () {
	quickExg.init();
});
