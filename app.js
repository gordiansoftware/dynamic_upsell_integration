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

app.get("/trip/:trip_id", async function (req, res, next) {
  let response = await fetch(url + "/trip/" + req.params.trip_id, {
    headers: {
      Authorization: "Basic " + Base64.encode(process.env.API_KEY + ":"),
      "Content-Type": "application/json"
    },
  })
  let json = await response.json();
  res.send(json);
})

/* New trip */
app.post("/trip", async function (req, res, next) {
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
          date_of_birth: "2000-01-01",
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
                  arrival_airport: "ATL",
                  arrival_time: "2021-08-21T06:58:00-05:00",
                  departure_airport: "LAX",
                  departure_time: "2021-08-20T23:50:00-08:00",
                  fare_basis: "WA7NR",
                  fare_class: "W",
                  fare_family: "book_it",
                  marketing_airline: "NK",
                  marketing_flight_number: "1200",
                  operating_airline: "NK",
                  operating_flight_number: "1200",
                  segment_id: "7092f993-ad94-4f76-815f-0b1936b1d970"
                },
                {
                  arrival_airport: "LAS",
                  arrival_time: "2021-08-21T10:03:00-08:00",
                  departure_airport: "ATL",
                  departure_time: "2021-08-21T08:30:00-05:00",
                  fare_basis: "WA7NR",
                  fare_class: "W",
                  fare_family: "book_it",
                  marketing_airline: "NK",
                  marketing_flight_number: "2802",
                  operating_airline: "NK",
                  operating_flight_number: "2802",
                  segment_id: "17922dd1-4a40-4590-823f-2234dd553674"
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
app.post("/fulfill", async function (req, res, next) {
  var fulfillUrl = url + "/trip/" + req.body.trip_id + "/fulfill";
  console.log("fulfill url: " + fulfillUrl);
  let response = await fetch(fulfillUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(process.env.API_KEY + ":"),
      "Content-Type": "application/json"
    },
    // Using mock data here for this demo.
    body: JSON.stringify({
      "contact_details": {
        "contact_details_type": "passenger",
        "passenger_id": req.body.passenger_id,
        "email": "joe@bloggs.com",
        "phone_number": "1234567890",
        "address": {
          "city": "Seattle",
          "state": "WA",
          "country": "US",
          "postal_code": "98105",
          "street_address_1": "123 Street St.",
        }
      },
      tickets: [
        {
          ticket_id: req.body.ticket_id,
          access_details: {
            record_locator: '123456'
          },
          status: 'booked'
        }
      ],
      "payment_details": {
        "payment_type": "card",
        "card_number": 9231836912116018,
        "cvv": 123,
        "expiry_month": "05",
        "expiry_year": "2040",
        "card_holder_name": "Gordian Software",
        "network": "visa",
        "billing_address": {
          "city": "Seattle",
          "state": "WA",
          "country": "US",
          "postal_code": "98105",
          "street_address_1": "123 Street St.",
        }
      }
    })
  });
  let json = await response.json();
  res.send(json);
});

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
