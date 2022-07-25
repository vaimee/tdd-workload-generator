const jsonpathQueries = [
  `$[?(@.properties.lightColor)]`,
  `$[?(@.properties.lightColor && @.properties.brightness)]`,
  `$[?(@.properties.sensorInformation)].properties..state`,
];

module.exports = jsonpathQueries;
/* 1. basic:  $[?(@.property == 'hello')]
2. newbie:  $[?(@.property == 'hello' && @.property2.sub == 'hey')]
3. intermediate:   $.properties.*[?(@.property == 'hello' && @.property2.sub == 'hey')]
3. advance: `$.properties.*.forms[?(@.href  ~= 'INSERT a REGEX')]`
4. super advance: d $.properties[?(@.type == "test")].forms[?(@.href  ~= 'INSERT a REGEX')] */
