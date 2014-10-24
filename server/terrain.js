var tmap = require("./tile_map.js");
var tgen = require("./terrain_generator.js");

var preMap = null, width = 100, height = 20, subDivs = 1, roughness = 0.2;

var tile = tgen.createTile(preMap, width, height, subDivs, roughness);
tmap.put(1, 2, tile);

var generateWorld = function() { 

};

module.exports.generateWorld = generateWorld;