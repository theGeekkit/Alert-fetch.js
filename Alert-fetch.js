const axios = require("axios");
const fs = require("fs");

async function run() {
  // setInterval(async () => {
  //     await fetchData();
  // }, 1000);
  await fetchData();
}

async function fetchData() {
  // Make a GET request
  try {
    let response = await axios.get(
      "https://api.weather.gov/alerts?point=37.01161240210997,-89.60530401388498"
    );

    let obj = response.data;
    let features = obj.features;

    //features.properties.references
    let topLevelFeatures = features.filter(
      (obj) => obj.properties.references.length <= 5
    );

    obj.features = topLevelFeatures;

    fs.writeFileSync("fourth_update.json", JSON.stringify(obj));

    console.log(topLevelFeatures.length);

    return;

    console.log(response.data);
    let data = response.data;
    console.log(data.features.length);
    data.features.forEach((feature) => {
      console.log(feature.id);
    });
  } catch (error) {
    console.error("Error:", error);
  }

  run().then(() => console.log("DONE"));
}
