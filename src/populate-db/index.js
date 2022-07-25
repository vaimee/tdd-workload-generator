const { ThingDescriptionLoader } = require('./thing-description-loader');
const { ThingDirectoryClient } = require('../common/thing-directory-client');

const thingDirectoryClient = new ThingDirectoryClient();

const reset = async () => {
  try {
    const response = await thingDirectoryClient.getAll();
    if (response.data.length === 0) return;
    const thingDescriptions = response.data;
    for (const thingDescription of thingDescriptions) {
      await thingDirectoryClient.delete(thingDescription.id);
    }
  } catch (error) {
    console.error(error);
    throw Error(`Problem reseting TDD`);
  }
};

const checkSize = async (size) => {
  const response = await thingDirectoryClient.getAll();
  if (response.data.length === size) return true;
  return false;
};

const populate = async () => {
  await reset();
  const thingDescriptionLoader = new ThingDescriptionLoader();
  await thingDescriptionLoader.load();
  const numberofThingDescriptions = process.env.NUMBER_OF_THING_DESCRIPTIONS;
  for (let i = 0; i <= numberofThingDescriptions; ) {
    const randomThing = thingDescriptionLoader.getRandomThing();
    const createThing = await thingDirectoryClient.createThing(randomThing);
    if (createThing) i++;
  }
  if (!checkSize(numberofThingDescriptions))
    throw new Error('number of TDs is not as defined');
  console.log(`${numberofThingDescriptions} TDs created!`);
  return;
};

//populate().then().catch(console.error);

module.exports = populate;
