var express = require('express');
var app = express();
var request = require('request');

//set our port
var port = process.env.PORT || 3000;

app.listen(3000, function(){
  console.log(`server started on ${port}`);
})
app.use(express.static('./js'))
app.set('view engine', 'ejs');

//home
app.get('/', function(req, res){
  var hotelsData;
  var price1Data;
  var price2Data;
  var price3Data;

//callback hell
  request.get("https://api.myjson.com/bins/1c80k", function (err, response, body) {
    hotelsData = JSON.parse(body);
    request.get("https://api.myjson.com/bins/2tlb8", function (err, response, body) {
      price1Data = {
        name: '2tlb8',
        data: JSON.parse(body)
      };
      request.get("https://api.myjson.com/bins/42lok", function (err, response, body) {
        price2Data = {
          name: '42lok',
          data: JSON.parse(body)
        };
        request.get("https://api.myjson.com/bins/15ktg", function (err, response, body) {
          price3Data = {
            name: '15ktg',
            data: JSON.parse(body)
          };

          var priceDatas = [price1Data, price2Data, price3Data];

          for (var i = 0; i < hotelsData.hotels.length; i++){
            var hotelId = hotelsData.hotels[i].id;
            var minPrice = null;
            var minPriceSource = null;

            for (var j = 0; j< priceDatas.length; j++){
              var price = priceDatas[j].data[hotelId];
              if (price) {
                if (minPrice === null || price < minPrice) {
                  minPrice = price;
                  minPriceSource = priceDatas[j].name;
                }
              }
            }
            hotelsData.hotels[i].minPrice = minPrice;
            hotelsData.hotels[i].minPriceSource = minPriceSource;
          }
          res.render('index', {
            hotels: hotelsData.hotels
          });
        })
      })
    })
  })

});

app.locals.hoteldata = require('./hoteldata.json');

app.get('/api', function(req,res,done) {
  request.get("https://api.myjson.com/bins/1c80k", function (err, response, body) {
    if (err) throw err
    res.json(JSON.parse(body))
  })
})

// app.get('/api1', function(req,res,done) {
//   request.get("https://api.myjson.com/bins/2tlb8", function (err, response, body) {
//     if (err) throw err
//     res.json(JSON.parse(body))
//   })
// })
//
// app.get('/api2', function(req,res,done) {
//   request.get("https://api.myjson.com/bins/42lok", function (err, response, body) {
//     if (err) throw err
//     res.json(JSON.parse(body))
//   })
// })
//
// app.get('/api3', function(req,res,done) {
//   request.get("https://api.myjson.com/bins/15ktg", function (err, response, body) {
//     if (err) throw err
//     res.json(JSON.parse(body))
//   })
// })
