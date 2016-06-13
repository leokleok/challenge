var express = require('express');
var app = express();
var request = require('request');

//set our port
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`server started on ${port}`);
})

app.set('view engine', 'ejs');

//home
app.get('/', function(req, res) {
  var count = 0;
  var hotelsData;

  request.get("https://api.myjson.com/bins/1c80k", function (err, response, body) {
    hotelsData = JSON.parse(body);
    count += 1;
    processData();
  });

  prices = {};
  var pricesApis = ['2tlb8','42lok','15ktg'];

   pricesApis.forEach(function(priceApi){
     request.get("https://api.myjson.com/bins/" + priceApi, function (err, response, body) {
      prices[priceApi] = JSON.parse(body);

       count += 1;
       processData();
     });
  });


  function processData() {
    if (count !== 4) {
      return;
    }

    hotelsData.hotels.forEach(function(hotel) {
      var hotelId = hotel.id;

      pricesApis.forEach(function(priceApi) {
        var price = prices[priceApi][hotelId];

        if ((price) && (hotel.minPrice === undefined || price < hotel.minPrice)) {
            hotel.minPrice = price;
          hotel.minPriceSource = priceApi;
        }
      });
    });

    res.render('index', {
      hotels: hotelsData.hotels
    });
  }
});
