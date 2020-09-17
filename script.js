const quickExg = {};

quickExg.apiKey = 'c264a6564be08eac4e720222e86b3b61';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

//getting "selection" from user to determine which currency string to use
quickExg.getInput = () => {
	$('.dropDown').on('change', function () {
		const selection = $(this).val();
		console.log(selection);
		quickExg.listData(selection);
	});
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
		// console.log(data.fiat);
		const fiatArray = Object.keys(data.fiat);
		// console.log(fiatArray);

		const cryptoArray = [];

		for (let curr in data.crypto) {
			console.log(curr.name_full);
			// let symbol = curr.symbol;
		}
		console.log(data);
		quickExg.dropDownMenu(fiatArray);
	});
};

//populate dropdown with symbols from populateOptions
quickExg.dropDownMenu = (currencyArray) => {
	currencyArray.forEach((currency) => {
		const result = $(`<option value='${currency}'>`).text(currency);
		$('.dropDown').append(result);
	});
};
// const userInput = quickExg.getInput();
// console.log(userInput);

// quickExg.displayInput;


//retreiving all data from API 
quickExg.listData = (input) => {
	$.ajax({
		url: quickExg.apiLive,
		method: 'GET',
		dataType: 'JSON',
		data: {
			access_key: quickExg.apiKey,
			target: input,
		},
	}).then((data) => {
		console.log(data);
		// console.log(data.fiat[input]);
		// console.log(data.crypto[input].name);
	});
};

//INIT FUNCTION
quickExg.init = () => {
	quickExg.getInput();
	quickExg.populateOptions();
};

//DOCUMENT READY FUNCTION
$(function () {
	quickExg.init();
});
