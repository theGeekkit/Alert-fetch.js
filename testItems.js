const fs = require("fs");
let readyToSend = [];
let alertedFeaturedIds = [];

async function findReferencedIds(obj) {
  const referencedIds = [];
  // console.log(urgentImmediate);
  obj.features.forEach((feature) => {
    feature.properties.references.forEach((reference) => {
      if (!referencedIds.includes(reference["@id"])) {
        referencedIds.push(reference["@id"]);
      }
    });
  });

  return referencedIds;
}

async function run() {
  const dat = fs.readFileSync("first_update.json");
  const obj = JSON.parse(dat);
  const currentDate = new Date("2023-08-04T11:50:00-05:00");
  // console.log(currentDate);

  const referencedIds = await findReferencedIds(obj);

  // console.log(referencedIds);
  const activeFeatures = [];
  obj.features.forEach((feature) => {
    const expirationDate = new Date(feature.properties.expires);
    // console.log(expirationDate, currentDate);
    if (
      !referencedIds.includes(feature.id) &&
      feature.properties.status === "Actual" &&
      feature.properties.messageType !== "Cancel" &&
      expirationDate > currentDate &&
      feature.properties.urgency === "Immediate"
    )
      console.log(typeof activeFeatures[0]);
    {
      activeFeatures.push(feature);
    }
  });
  console.log("its here", activeFeatures);
  fs.writeFileSync("activeFeatures.json", JSON.stringify(activeFeatures)); //list of active alert for the end user

  const severeOrExtremeFeatures = activeFeatures.filter(
    (feature) =>
      feature.properties.severity === "Severe" ||
      feature.properties.severity === "Extreme"
  );

  const alertedIds = new Set(alertsThatNeedToBeNotified.map((feature) => feature.id));
  const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
    (feature) => {
      const featureId = feature.id;
      const referenceIds = feature.references.map((reference) => reference.id);

      // Check if either the feature ID or any of the reference IDs are in alertedIds
      return ![featureId, ...referenceIds].some((id) => alertedIds.has(id));
    }
  );

  fs.writeFileSync(
    "alertsThatNeedToBeNotified.json",
    JSON.stringify(filteredSevereOrExtremeFeatures)
  );
}

run().catch((error) => {
  console.error(error);
});

