const quickExg = {};

quickExg.apiKey = 'c264a6564be08eac4e720222e86b3b61';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

quickExg.getInput = () => {
	$('#userCurrency').on('change', function () {
		const selection = $(this).val();
		console.log(selection);
		quickExg.listData(selection);
	});
};

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
		const newArray = Object.keys(data.fiat);
		console.log(newArray);
		quickExg.dropDownMenu(newArray);
	});
};

quickExg.dropDownMenu = (currencyArray) => {
	currencyArray.forEach((currency) => {
		const result = $(`<option value='${currency}'>`).text(currency);
		$('#userCurrency').append(result);
	});
};

// $('')

// const userInput = quickExg.getInput();
// console.log(userInput);

// quickExg.displayInput;

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

// quickExg.listData('USD');

quickExg.init = () => {
	quickExg.getInput();
	quickExg.populateOptions();
};

$(function () {
	quickExg.init();
});
