const create_table = () => {
  var row = document.createElement("tr");
  var productCell = document.createElement("td");
  var priceCell = document.createElement("td");
  return [row, productCell, priceCell]
}

const main = async () => {
  console.log(
    "Step 1: get the trip_id and trip_access_token from your backend"
  );
  const tripResponse = await fetch("/trip", {
    method: "POST"
  });

  const tripJson = await tripResponse.json();
  const { trip_id, trip_access_token, passengers, tickets } = tripJson;

  if (!trip_id) {
    console.error("failed to create trip: " + JSON.stringify(tripJson));
    return;
  }
  console.log(`trip_id: ${trip_id}, trip_access_token: ${trip_access_token}`);
  console.log(tripJson);
  const firstPassenger = passengers[0];
  const firstTicket = tickets[0];
  const { passenger_id } = firstPassenger;
  const { ticket_id } = firstTicket;

  const onBasketChange = ({ basket }) => {
    console.log("Step 4: handle basket changes");
    var basketBody = document.getElementById("basket-body");
    const [row, productCell, priceCell] = create_table();
    while (basketBody.firstChild) {
      basketBody.removeChild(basketBody.firstChild);
    }
    for (var key in basket) {
      const product = basket[key];
      
      productCell.innerText = product.display_name;
      priceCell.innerText = window.Gordian.formatPrice(
        product.price.total.amount,
        product.price.total.decimal_places,
        product.price.total.currency
      );
      row.appendChild(productCell);
      row.appendChild(priceCell);
      basketBody.appendChild(row);
    }
  };

  console.log("Step 2: initialize the SDK");
  window.Gordian.init({
    tripId: trip_id,
    tripAccessToken: trip_access_token,
    onBasketChange: onBasketChange
  });

  const getTrip = async () => {
    console.log("Step 7: Poll the trip");
    const response = await fetch(`/trip/${trip_id}`);
    const { orders = {} } = response.json();
    console.log(orders);

    const fulfillmentBody = document.getElementById("fulfillment-body");

    // Clear the current table showing fulfillment status
    while (fulfillmentBody.firstChild) {
      fulfillmentBody.removeChild(fulfillmentBody.firstChild);
    }
    
    for (const key in orders) {
      const { display_name, price, status } = orders[key];
      const row = document.createElement("tr");
      const productCell = document.createElement("td");
      const priceCell = document.createElement("td");
      const statusCell = document.createElement("td");
      productCell.innerText = display_name;
      priceCell.innerText = window.Gordian.formatPrice(
        price.total.amount,
        price.total.decimal_places,
        price.total.currency
      );
      statusCell.innerText = status;
      row.appendChild(productCell);
      row.appendChild(priceCell);
      row.appendChild(statusCell);
      fulfillmentBody.appendChild(row);
    }
  }

  const showUpsell = async () => {
    console.log("Step 3: show the upsell options to the user");
    try {
      await window.Gordian.showUpsell({
        container: document.getElementById("upsell-container"),
        display: "card", // card | embedded | modal
        allowProducts: ["seats", "bags"]
      });
    }
    catch(error) {
      console.error(`unable to show upsell: ${error.message}`);
    }
  };

  const fulfill = async () => {
    // Fulfillment should be done on the server side, not the client side.
    const response = await fetch("/fulfill", {
      method: "POST",
      body: JSON.stringify({
        trip_id,
        passenger_id,
        ticket_id
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const jsonResponse = response.json();
    
    if (jsonResponse.status === "success") {
      console.log("Step 6: fulfill their selected options");
    } else {
      console.log(JSON.stringify(jsonResponse));
    }
  };

  document.getElementById("fulfill").addEventListener("click", fulfill);
  document.getElementById("get-trip").addEventListener("click", getTrip);

  await showUpsell();
};

main();
