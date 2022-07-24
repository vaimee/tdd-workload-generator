const MersenneTwister = require("mersenne-twister");

export class Random {
  static #randomGenerator;
  constructor(seed = Math.random()) {
    this.#randomGenerator = MersenneTwister(seed);
  }

  static getRandom() {
    return this.#randomGenerator.random();
  }

  static exponentialGenerator(lambda) {
    return Math.log(1 - this.getRandom()) / (-1 * lambda);
  }
}
