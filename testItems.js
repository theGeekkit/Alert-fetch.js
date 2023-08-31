const fs = require("fs");
const { features } = require("process");
urgentImmediate = {};
async function findReferencedIds(obj) {
  const referencedIds = [];
  urgentImmediate = obj.features.filter(
    (feature) => feature.urgency === "Immediate"
  );
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
  const notReferencedFeatures = [];
  obj.features.forEach((feature) => {
    const expirationDate = new Date(feature.properties.expires);
    // console.log(expirationDate, currentDate);
    if (
      !referencedIds.includes(feature.id) &&
      feature.properties.status === "Actual" &&
      feature.properties.messageType !== "Cancel" &&
      expirationDate > currentDate &&
      urgentImmediate
    ) {
      notReferencedFeatures.push(feature);
    }
  });
  console.log("its here",notReferencedFeatures);
  fs.writeFileSync(
    "notReferencedFeatures.json",
    JSON.stringify(notReferencedFeatures)
  ); //list of active alert for the end user
  //run through all of those not referenced features. Run your notify logic, as a console log. Keep track of those you have notified
  //iteratively process all of the files. mimic the process of getting file updates
}

run().catch((error) => {
  console.error(error);
});
