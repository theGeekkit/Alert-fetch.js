const fs = require("fs");
const { features } = require("process");

async function findReferencedIds(obj) {
  const referencedIds = [];

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
  const currentDate = new Date();

  console.log(currentDate);

  const referencedIds = await findReferencedIds(obj);

  console.log(referencedIds);
  const notReferencedFeatures = [];
  obj.features.forEach((feature) => {
    const expirationDate = new Date(feature.properties.expires);
    // console.log(expirationDate, currentDate);
    if (
      !referencedIds.includes(feature.id) &&
      feature.properties.messageType !== "Cancel" &&
      expirationDate > currentDate
    ) {
      notReferencedFeatures.push(feature);
    }
  });
  console.log(notReferencedFeatures);
  fs.writeFileSync(
    "notReferencedFeatures.json",
    JSON.stringify(notReferencedFeatures)
  );
}

run().catch((error) => {
  console.error(error);
});
