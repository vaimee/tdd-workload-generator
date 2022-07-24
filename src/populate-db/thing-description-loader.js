const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const readDirectory = util.promisify(fs.readdir);
require('dotenv').config();

const { Random } = require('../common/random');
const config = require('../config');

class ThingDescriptionLoader {
  constructor(path = process.env.THING_DESCRIPTION_PATH) {
    this.path = path;
    this.thingDescriptions = {
      simple: [],
      medium: [],
      complex: [],
    };
  }

  async load() {
    for (const tdCategory in this.thingDescriptions)
      await this.readThingDirectoryFolder(tdCategory);
    return this.thingDescription;
  }

  async readThingDirectoryFolder(directory) {
    try {
      const directoryPath = path.join(__dirname, `${this.path}/${directory}`);
      const filenamesArray = await readDirectory(directoryPath);
      for (const filename of filenamesArray) {
        const thingDescription = await this.readThingDirectoryFile(
          directoryPath,
          filename,
        );
        //console.log(thingDescription);
        this.thingDescriptions[directory].push(thingDescription);
      }
    } catch (error) {
      console.error(`*** Error reading directory ${directory} ***`);
      console.log(error);
    }
  }

  async readThingDirectoryFile(directoryPath, filename) {
    try {
      const filePath = path.join(directoryPath, filename);
      const fileData = await readFile(filePath, 'utf8');
      return JSON.parse(fileData);
    } catch (error) {
      console.error(`*** Error reading file ${filename} from ${directoryPath} ***`);
      console.error(error);
    }
  }

  #selector() {
    const random = Random.getRandom();
    const distribution = config.thingDescriptionDistribution;
    if (random < distribution.simple) return 'simple';
    else if (random < distribution.medium) return 'medium';
    return 'complex';
  }

  getRandomThing() {
    const category = this.#selector();
    const index = Random.getRandomInt(0, this.thingDescriptions[category].length);
    return this.thingDescriptions[category][index];
  }
}

module.exports = {
  ThingDescriptionLoader,
};
