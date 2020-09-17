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

const url = "https://api.gordiansoftware.com/v2.2";

/* New trip */
app.post("/trip", async function(req, res, next) {
  let response = await fetch(url + "/trip", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(process.env.API_KEY + ":"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country: "US",
      currency: "USD",
      language: "en-US",
      passengers: [
        {
          first_names: "Van Gogh",
          surname: "William",
          passenger_type: "adult",
          date_of_birth: "2000-01-01",
          loyalty_program: {
            airline_id: "AA",
            number: "123456789",
            program_name: "Premium",
            tier_name: "Gold"
          }
        },
        {
          passenger_type: "adult",
          date_of_birth: "2019-01-01",
          first_names: "Ali",
          surname: "Reza",
          loyalty_program: {
            airline_id: "AA",
            number: "123456789",
            program_name: "Premium",
            tier_name: "Gold"
          }
        }
      ],
      tickets: [
        {
          journeys: [
            {
              segments: [
                 {
                  arrival_airport: "LAS",
                  departure_time: "2020-12-24T07:15:00-04:00",
                  departure_airport: "DTW",
                  arrival_time: "2020-12-24T08:49:00-07:00",
                  fare_basis: "LKX9C3B4",
                  fare_class: "L",
                  fare_family: "ECONOMY_BASIC",
                  marketing_airline: "NK",
                  marketing_flight_number: "111"
                }
              ]
            }
          ],
          metadata: {
            "your-id": "your-key"
          },
          offered_price: {
            base_price: 7000,
            currency: "USD",
            decimal_places: 2,
            markup: 0,
            total: 7000
          },
          status: "offered"
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
