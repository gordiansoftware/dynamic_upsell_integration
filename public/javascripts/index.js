const main = async () => {
  console.log(
    "Step 1: get the trip_id and trip_access_token from your backend"
  );
  const tripResponse = await fetch("/trip", {
    method: "POST"
  });

  const tripJson = await tripResponse.json();
  const { trip_id, trip_access_token } = tripJson;

  if (!trip_id) {
    console.error("failed to create trip: " + JSON.stringify(tripJson));
    return;
  }
  console.log(`trip_id: ${trip_id}, trip_access_token: ${trip_access_token}`);

  const onBasketChange = basket => {
    console.log("Step 4: handle basket changes");
    var basketBody = document.getElementById("basket-body");
    basketBody.innerHTML = "";
    for (var booking of basket.bookings) {
      for (var product of booking.products) {
        var row = document.createElement("tr");
        row.classList.remove("invalid");
        var productCell = document.createElement("td");
        var priceCell = document.createElement("td");
        productCell.innerText = product.display_name;
        priceCell.innerText = window.Gordian.formatPrice(
          product.price.total,
          product.price.decimal_places,
          product.price.currency
        );
        var message = document.createElement("message");

        product.validity = product.validity || { state: "valid" }; // TODO: remove
        if (product.validity.state === "valid") {
        } else if (product.validity.state === "checking") {
          row.classList.add("checking");
          message.innerText = "Checking if this product is still available...";
        } else if (product.validity.state === "price_changed") {
          row.classList.add("price_changed");
          message.innerText = "The price for this product has changed!";
        } else if (product.validity.state === "unavailable") {
          row.classList.add("unavailable");
          message.innerText = "Sorry, this product is no longer available";
        }
        priceCell.appendChild(message);
        row.appendChild(productCell);
        row.appendChild(priceCell);
        basketBody.appendChild(row);
      }
    }
  };

  console.log("Step 2: initialize the SDK");
  window.Gordian.init({
    tripId: trip_id,
    tripAccessToken: trip_access_token,
    onBasketChange: onBasketChange
  });

  const showUpsell = async () => {
    console.log("Step 3: show the upsell options to the user");
    await window.Gordian.showUpsell({
      container: document.getElementById("upsell-container"),
      display: "card", // card | embedded | modal
      allowProducts: ["seats"]
    }).catch(error => {
      console.error(`unable to show upsell: ${error.message}`);
    });
  };

  const fulfill = async () => {
    await fetch("/fulfill", {
      method: "POST",
      body: JSON.stringify({
        trip_id: trip_id
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.status === "success") {
          console.log("Step 6: fulfill their selected options");
        } else {
          console.log(JSON.stringify(json));
        }
      });
  };

  document.getElementById("fulfill").addEventListener("click", fulfill);

  await showUpsell();
};

main();
