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
  var price1Data;
  var price2Data;
  var price3Data;

  request.get("https://api.myjson.com/bins/1c80k", function (err, response, body) {
    hotelsData = JSON.parse(body);
    count += 1;
    processData();
  });
  request.get("https://api.myjson.com/bins/2tlb8", function (err, response, body) {
    price1Data = {
      name: '2tlb8',
      data: JSON.parse(body)
    };
    count += 1;
    processData();
  });
  request.get("https://api.myjson.com/bins/42lok", function (err, response, body) {
    price2Data = {
      name: '42lok',
      data: JSON.parse(body)
    };
    count += 1;
    processData();
  });
  request.get("https://api.myjson.com/bins/15ktg", function (err, response, body) {
    price3Data = {
      name: '15ktg',
      data: JSON.parse(body)
    };
    count += 1;
    processData();
  });

  function processData() {
    if (count !== 4) {
      return;
    }

    var priceDatas = [price1Data, price2Data, price3Data];

    hotelsData.hotels.forEach(function(hotel) {
      var hotelId = hotel.id;
      var minPrice = null;
      var minPriceSource = null;

      priceDatas.forEach(function(priceData) {
        var price = priceData.data[hotelId];
        if (price) {
          if (minPrice === null || price < minPrice) {
            minPrice = price;
            minPriceSource = priceData.name;
          }
        }
      });
      hotel.minPrice = minPrice;
      hotel.minPriceSource = minPriceSource;
    });

    res.render('index', {
      hotels: hotelsData.hotels
    });
  }
});
