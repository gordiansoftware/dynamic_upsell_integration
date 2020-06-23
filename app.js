var express = require("express");
var path = require("path");
var Base64 = require("js-base64").Base64;
var fetch = require("node-fetch");
var logger = require("morgan");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// const url = "https://api.gordiansoftware.com/v2.2";
const url = "https://gordian-corev2-test.herokuapp.com/v2.2";

/* New trip */
app.post("/trip", async function(req, res, next) {
  let response = await fetch(url + "/trip", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(process.env.API_KEY + ":"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      language: "en",
      currency: "USD",
      country: "US",
      partner_basket: [
        {
          product_type: "ticket",
          offered_price: {
            currency: "USD",
            decimal_places: 2,
            base_price: 7000,
            markup: 0,
            total: 7000
          },
          journeys: [
            {
              segments: [
                {
                  arrival_airport: "LAS",
                  arrival_time: "2020-08-05T15:54:00-08:00",
                  departure_airport: "PDX",
                  departure_time: "2020-08-05T13:38:00-08:00",
                  fare_basis: "LKX9C3B4",
                  fare_class: "L",
                  fare_family: "ECONOMY_BASIC",
                  marketing_airline: "NK",
                  marketing_flight_number: "671"
                }
              ]
            },
            {
              segments: [
                {
                  arrival_airport: "PDX",
                  arrival_time: "2020-08-10T12:52:00-08:00",
                  departure_airport: "LAS",
                  departure_time: "2020-08-10T10:39:00-08:00",
                  fare_basis: "LKX9C3B4",
                  fare_class: "L",
                  fare_family: "ECONOMY_BASIC",
                  marketing_airline: "NK",
                  marketing_flight_number: "765",
                  operating_airline: "NK",
                  operating_flight_number: "765"
                }
              ]
            }
          ]
        }
      ],
      passengers: [
        {
          passenger_type: "adult",
          infant_on_lap: {
            passenger_type: "infant"
          }
        }
      ]
    })
  });
  let json = await response.json();
  res.send(json);
});

/* Fulfill */
app.post("/fulfill", async function(req, res, next) {
  var fulfillUrl = url + "/trip/" + req.trip_id + "/fulfill";
  console.log("fulfill url: " + fulfillUrl);
  let response = await fetch(fulfillUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(process.env.API_KEY + ":"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  let json = await response.json();
  res.send(json);
});

var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
