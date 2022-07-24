const config = {
  thingDescriptionDistribution: {
    simple: process.env.SIMPLE || 0.8,
    medium: process.env.MEDIUM || 0.15,
    complex: process.env.COMPLEX || 0.5,
  },
};

module.exports = config;
