const quickExg = {};

let globalCrypto = [];
// could hold objects with {symbol: and rate:}

// holds objects of name, symbol
const symbol = [];

quickExg.apiKey = 'c264a6564be08eac4e720222e86b3b61';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';


// when user clicks start on modal, fade out
quickExg.addStartButton = function () {
	$('.start').on('click', function () {
		$('.modalContainer').fadeOut('800');
	})
}

//getting "selection" from user to determine which currency string to use
quickExg.getInput = () => {
	// when the user changes the dropdown selection
	$('.dropDown').on('change', function () {
		// the selction variable holds that string val
		const selection = $(this).val();
		// pass that selection var into the listData
		quickExg.symbolConverter(selection);
	});
};

// `````````````````THIS PARAM IS THE SELECTION
quickExg.symbolConverter = (input) => {
	// symbol is array. element is ref.
	symbol.forEach((element) => {
		if (input === element.name) {
			console.log(element.symbol);
		}
	})
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
		const fiatCurrencies = data.fiat;
		globalFiat = fiatCurrencies;
		const fiatDisplay = [];
		for (const key in fiatCurrencies) {
			fiatDisplay.push(`${fiatCurrencies[key]} (${key})`);
		}

		const cryptoCurrencies = data.crypto;
		const cryptoDisplay = [];
		for (let key in cryptoCurrencies) {
			// this gets us the individual currency objects
			const item = cryptoCurrencies[key];
			// for use in our display
			const fullName = item.name_full;

			// this sends into our symbol array
			const ref = {
				name: fullName,
				symbol: item.symbol,
			}
			symbol.push(ref);
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
	$('.sell').on('submit', function (e) {
		e.preventDefault();
		// $('.dollarBuy').attr('value', $('.dollarSell').val());
		const sellValue = $('.dollarSell').val();
	});
};

//INIT FUNCTION
quickExg.init = () => {
	quickExg.addStartButton();
	quickExg.getInput();
	quickExg.symbolConverter();
	quickExg.populateOptions();
	quickExg.displayAmt();
	quickExg.ratesData();
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
