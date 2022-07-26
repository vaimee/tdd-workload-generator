const fs = require('fs');
const path = require('path');
const util = require('util');
const appendFile = util.promisify(fs.appendFile);

let processingTimes = [];

const record = async (time, replication) => {
  const filename = `${process.env.SERVER}_${process.env.NUMBER_OF_THING_DESCRIPTIONS}_${
    replication + 1
  }`;
  const processingTime = time[0] + time[1] / 1000000000;
  processingTimes.push(processingTime);
  const directoryPath = path.join(
    __dirname,
    `../../assets/experiment-results/raw/${filename}.csv`,
  );
  await appendFile(directoryPath, `${processingTime}\n`);
};

const recordAverage = async () => {
  const sum = processingTimes.reduce((a, b) => a + b, 0);
  const average = sum / processingTimes.length || 0;
  const filename = `${process.env.SERVER}_${process.env.NUMBER_OF_THING_DESCRIPTIONS}`;
  const directoryPath = path.join(
    __dirname,
    `../../assets/experiment-results/average/${filename}.csv`,
  );
  await appendFile(directoryPath, `${average}\n`);
  processingTimes = [];
  console.log('***CLEANED PROCESSING TIMES***');
  return;
};
module.exports = { record, recordAverage };
