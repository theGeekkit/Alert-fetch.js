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

  const readyToSendIds = new Set(readyToSend.map((feature) => feature.id));
  const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
    (feature) => !readyToSendIds.has(feature.id)
  );

  fs.writeFileSync(
    "readyToSend.json",
    JSON.stringify(filteredSevereOrExtremeFeatures)
  );
}

run().catch((error) => {
  console.error(error);
});

// async function calculateActiveFeatures(obj, currentDate) {
//   return new Promise((resolve) => {
//     const activeFeatures = [];
//     obj.features.forEach((feature) => {
//       const expirationDate = new Date(feature.properties.expires);
//       if (
//         !referencedIds.includes(feature.id) &&
//         feature.properties.status === "Actual" &&
//         feature.properties.messageType !== "Cancel" &&
//         expirationDate > currentDate &&
//         feature.properties.urgency === "Immediate"
//       ) {
//         activeFeatures.push(feature);
//       }
//     });
//     resolve(activeFeatures);
//   });
// }

// async function run() {
//   const dat = fs.readFileSync("first_update.json");
//   const obj = JSON.parse(dat);
//   const currentDate = new Date("2023-08-04T11:50:00-05:00");

//   const referencedIds = await findReferencedIds(obj);

//   // Calculate active features asynchronously
//   const activeFeatures = await calculateActiveFeatures(obj, currentDate);

//   console.log("its here", activeFeatures);
//   fs.writeFileSync("activeFeatures.json", JSON.stringify(activeFeatures)); //list of active alert for the end user

//   const severeOrExtremeFeatures = activeFeatures.filter(
//     (feature) =>
//       feature.properties.severity === "Severe" ||
//       feature.properties.severity === "Extreme"
//   );

//   const readyToSendIds = new Set(readyToSend.map((feature) => feature.id));
//   const filteredSevereOrExtremeFeatures = severeOrExtremeFeatures.filter(
//     (feature) => !readyToSendIds.has(feature.id)
//   );

//   fs.writeFileSync(
//     "readyToSend.json",
//     JSON.stringify(filteredSevereOrExtremeFeatures)
//   );

//run through all of those not referenced features. Run your notify logic, as a console log. Keep track of those you have notified
//iteratively process all of the files. mimic the process of getting file updates

/*


    loop through activeFeatures (feature) {

      if(feature needs to be alerted) {
        if(feature has not been alerted and feature reference have not been alerted) {
          console.log(feature)//// e.g. pretend that we alerted
          add feature id to the alerted list

        }
      }


    }


    */
