const url = "https://www.carboninterface.com/api/v1/estimates"; // Replace with the actual endpoint URL

data = {
  "type": "shipping",
      "weight_value": 5,
      "weight_unit": "lb",
      "distance_value": 2000,
      "distance_unit": "mi",
      "transport_method": "truck"
};

fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Bearer eINv60QdXD2xhUvM2ezbJw", // Replace with your actual token if dynamic
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error("There was a problem with the fetch operation:", error));

