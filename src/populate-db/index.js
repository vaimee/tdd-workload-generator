const { Random } = require('../common/random');
const { ThingDescriptionLoader } = require('./thing-description-loader');
const { ThingDirectoryClient } = require('./thing-directory-client');

Random.setSeed(process.env.SEED);

const thingDescriptionLoader = new ThingDescriptionLoader();
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

const start = async () => {
  await reset();
  await thingDescriptionLoader.load();
  const numberofThingDescriptions = process.env.NUMBER_OF_THING_DESCRIPTIONS;
  for (let i = 0; i <= numberofThingDescriptions; ) {
    const randomThing = thingDescriptionLoader.getRandomThing();
    const createThing = await thingDirectoryClient.createThing(randomThing)
    if (createThing) i++;
  }
};

start().then().catch(console.error);
