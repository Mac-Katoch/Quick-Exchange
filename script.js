const quickExg = {}

quickExg.apiKey = 'c264a6564be08eac4e720222e86b3b61';
quickExg.apiList = 'http://api.coinlayer.com/api/list';
quickExg.apiLive = 'http://api.coinlayer.com/api/live';

quickExg.listData = $.ajax({
    url: quickExg.apiList,
    method: 'GET',
    dataType: 'JSON',
    data: {
        access_key: quickExg.apiKey,
    }
}).then((data) => {
    console.log(data)
})