// const fs = require("fs");
// const { features } = require("process");
// let urgentImmediate = {};
// async function findReferencedIds(obj) {
//   const referencedIds = [];
//   urgentImmediate = obj.features.filter(
//     (feature) => feature.urgency === "Immediate"
//   );
//   console.log(urgentImmediate);
//   obj.features.forEach((feature) => {
//     feature.properties.references.forEach((reference) => {
//       if (!referencedIds.includes(reference["@id"])) {
//         referencedIds.push(reference["@id"]);
//       }
//     });
//   });

//   return referencedIds;
// }

// async function run() {
//   const dat = fs.readFileSync("first_update.json");
//   const obj = JSON.parse(dat);
//   const currentDate = new Date();
//   console.log(currentDate);

//   const referencedIds = await findReferencedIds(obj);

//   console.log(referencedIds);
//   const notReferencedFeatures = [];

//   obj.features.forEach((feature) => {
//     const expirationDate = new Date(feature.properties.expires);
//     // console.log(expirationDate, currentDate);
//     if (
//       !referencedIds.includes(feature.id) &&
//       feature.properties.status === "Actual" &&
//       feature.properties.messageType !== "Cancel" &&
//       expirationDate > currentDate &&
//       urgentImmediate
//     ) {
//       notReferencedFeatures.push(feature);

//       fs.writeFileSync(
//         "notReferencedFeatures.json",
//         JSON.stringify(notReferencedFeatures)
//       );
//     }
//   });
//   console.log(notReferencedFeatures);
// }

// run().catch((error) => {
//   console.error(error);
// });


const fs = require("fs");

async function findReferencedIds(obj) {
  const referencedIds = [];
  const urgentImmediate = obj.features.filter(
    (feature) => feature.urgency === "Immediate"
  );

  console.log(urgentImmediate);

  obj.features.forEach((feature) => {
    feature.properties.references.forEach((reference) => {
      if (!referencedIds.includes(reference["@id"])) {
        referencedIds.push(reference["@id"]);
      }
    });
  });

  return { referencedIds, urgentImmediate };
}

async function run() {
  const dat = fs.readFileSync("first_update.json");
  const obj = JSON.parse(dat);
  const currentDate = new Date();
  console.log(currentDate);

  const { referencedIds, urgentImmediate } = await findReferencedIds(obj);

  console.log(referencedIds);
  const notReferencedFeatures = [];

  obj.features.forEach((feature) => {
    const expirationDate = new Date(feature.properties.expires);

    if (
      !referencedIds.includes(feature.id) &&
      feature.properties.status === "Actual" &&
      feature.properties.messageType !== "Cancel" &&
      expirationDate > currentDate &&
      urgentImmediate.some((urgent) => urgent.id === feature.id) // Checking if current feature is in urgentImmediate
    ) {
      notReferencedFeatures.push(feature);
      fs.writeFileSync(
        "notReferencedFeatures.json",
        JSON.stringify(notReferencedFeatures)
      );
    }
  });

  console.log(notReferencedFeatures);
}

run().catch((error) => {
  console.error(error);
});
