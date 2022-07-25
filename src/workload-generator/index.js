const { Random } = require('../common/random');
const { ThingDirectoryClient } = require('../common/thing-directory-client');
const config = require('../config');
const populate = require('../populate-db');
const jsonpathQueries = require('./jsonpath-queries');
const recorder = require('../utils/recorder');
require('dotenv').config();

const thingDirectoryClient = new ThingDirectoryClient();

const performSingleReplication = async (replication) => {
  for (let i = 0; i < process.env.CALLS_WITHIN_REPLICATION; i++) {
    const hrstart = process.hrtime();
    const query = jsonpathQueries[Random.getRandomInt(0, jsonpathQueries.length)];
    await thingDirectoryClient.jsonpathQuery(query);
    await recorder.record(process.hrtime(hrstart), replication);
  }
  await recorder.recordAverage();
};

const start = async () => {
  for (let i = 0; i < process.env.REPLICATIONS; i++) {
    Random.setSeed(config.seeds[i]);
    await populate();
    await performSingleReplication(i);
  }
};

start().then().catch(console.error);
