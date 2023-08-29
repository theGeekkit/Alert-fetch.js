const fs = require("fs");

const currentDate = new Date();

console.log(currentDate);


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

  const referencedIds = await findReferencedIds(obj);

  console.log(referencedIds);
  const notReferencedFeatures = [];
  obj.features.forEach((feature) => {
    if (!referencedIds.includes(feature.id) && feature.properties.messageType !== 'Cancel') {


        if(!referencedIds.includes(features.properties.expiration)) {
            notReferencedFeatures.push(feature)
        }
    
    
    
    
    
    }    
  });
  console.log(notReferencedFeatures)
  fs.writeFileSync("notReferencedFeatures.json", JSON.stringify(notReferencedFeatures))
}

run().catch((error) => {
  console.error(error);
});
