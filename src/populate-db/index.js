const { ThingDescriptionLoader } = require('./thing-description-loader');
const thingDescriptionLoader = new ThingDescriptionLoader();

const start = async () => {
  await thingDescriptionLoader.load();
  console.log(thingDescriptionLoader.thingDescriptions);
};

start().then().catch(console.error);
