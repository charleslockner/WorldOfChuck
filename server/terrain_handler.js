/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use  Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var generator = require("./terrain_generator.js");
var tileMap = require("./tile_map.js");
var fs = require("fs");

var MAX_ROUGHNESS = 0.3;
var MIN_ROUGHNESS = 0.02;
var ROUGHNESS_DEV = 0.12;

module.exports.createTile = function(x, z, tileWidth, tileHeight, subdivs, callback) {
   // process.nextTick(function() {
      var sideVerts = Math.pow(2, subdivs) + 1
      var preArr = createMapFromSurroundings(x, z, sideVerts);
      var roughness = calculateRoughnessFromSurroundings(x, z, MIN_ROUGHNESS, MAX_ROUGHNESS, ROUGHNESS_DEV);
      var tileJSON = generator.createTile(preArr, tileWidth, tileHeight, subdivs, roughness);

      tileMap.put(x, z, tileJSON);
      saveTile(x, z, tileJSON);
      
      if (callback)
         callback(tileJSON, x, z);       
    // });
}

var createMapFromSurroundings = function(x, z, sideVerts) {
   var preArr = generator.createEmptyArray(sideVerts);

   // Set left side
   var leftTile = tileMap.get(x-1, z);
   if (leftTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[0][i] = leftTile.heightMap[sideVerts-1][i];

   // Set right side
   var rightTile = tileMap.get(x+1, z);
   if (rightTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[sideVerts-1][i] = rightTile.heightMap[0][i];

   // Set top side
   var topTile = tileMap.get(x, z-1);
   if (topTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[i][0] = topTile.heightMap[i][sideVerts-1];

   // Set bottom side
   var bottomTile = tileMap.get(x, z+1);
   if (bottomTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[i][sideVerts-1] = bottomTile.heightMap[i][0];

   return preArr;
}

var calculateRoughnessFromSurroundings = function(x, z, min, max, sensitivity) {
   var roughSum = 0;
   var tileCount = 0;

   var topTile = tileMap.get(x, z-1);
   if (topTile) {
      roughSum += topTile.roughness;
      tileCount++;
   }

   var bottomTile = tileMap.get(x, z+1);
   if (bottomTile) {
      roughSum += bottomTile.roughness;
      tileCount++;
   }

   var leftTile = tileMap.get(x-1, z);
   if (leftTile) {
      roughSum += leftTile.roughness;
      tileCount++;
   }

   var rightTile = tileMap.get(x+1, z);
   if (rightTile) {
      roughSum += rightTile.roughness;
      tileCount++;
   }

   if (tileCount > 0) {
      var dev = sensitivity / 2;
      var ave = roughSum / tileCount;
      var rawRandomness = randRange(ave - dev, ave + dev);
      return Math.max(min, Math.min(max, rawRandomness));
   }
   else
      return randRange(min, max);
}

var randRange = function(low, high) {
   return (high - low) * Math.random() - low
}

var saveTile = function(x, z, tileJSON, callcack) {
   var path = "assets/models/terrain/" + x + "." + z + ".json";

   fs.writeFile(path, JSON.stringify(tileJSON), function(err) {
      if(err)
         console.log(err);
   }); 
}
