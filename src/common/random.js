const MersenneTwister = require('mersenne-twister');

class Random {
  static #randomGenerator;
  
  static setSeed(seed) {
    this.#randomGenerator = new MersenneTwister(seed)
  }

  static getRandom() {
    return this.#randomGenerator.random();
  }

  static exponentialGenerator(lambda) {
    return Math.log(1 - this.getRandom()) / (-1 * lambda);
  }

  static getRandomInt(min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(this.getRandom() * (max - min)) + min;
  }
}

module.exports = {
  Random,
};
