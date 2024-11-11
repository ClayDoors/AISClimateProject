const url = "https://www.carboninterface.com/api/v1/estimates"; // Replace with the actual endpoint URL

data = {
  type: "vehicle",
  distance_unit: "mi",
  distance_value: 100,
  vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9"
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

