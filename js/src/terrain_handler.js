/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var TerrainHandler = function(gl, tileWidth, tileHeight, reps) {
   this.gl = gl;
   this.tileWidth = tileWidth;

   this.generator = new TerrainGenerator(tileWidth, tileHeight, reps);
   this.tileMap = new TileMap(tileWidth);

   $.cookie.json = true; // Makes cookies take in json by default
}

TerrainHandler.prototype.createTile = function(x, z) {
   var loadedTile = this.loadTile(x, z);
   console.log(loadedTile);
   var tileJSON = loadedTile ? loadedTile : this.createNewTile(x, z);
   var tileModel = ModelLoader.createFromJSON(this.gl, tileJSON);

   var tile = {
      JSON : tileJSON,
      model : tileModel
   }

   this.tileMap.put(x, z, tile);
}

TerrainHandler.prototype.createNewTile = function(x, z) {
   var preArr = this.createMapFromSurroundings(x, z);
   var roughness = this.calculateRoughnessFromSurroundings(x, z, 0.02, 0.5, 0.2);
   var tileJSON = this.generator.createTile(preArr, roughness);
   this.saveTile(x, z, tileJSON);
   return tileJSON;
}

TerrainHandler.prototype.createMapFromSurroundings = function(x, z) {
   var preArr = this.generator.createEmptyArray();
   var sideVerts = this.generator.sideVerts;

   // Set left side
   var leftTile = this.tileMap.get(x-1, z);
   if (leftTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[0][i] = leftTile.JSON.heightMap[sideVerts-1][i];

   // Set right side
   var rightTile = this.tileMap.get(x+1, z);
   if (rightTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[sideVerts-1][i] = rightTile.JSON.heightMap[0][i];

   // Set top side
   var topTile = this.tileMap.get(x, z-1);
   if (topTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[i][0] = topTile.JSON.heightMap[i][sideVerts-1];

   // Set bottom side
   var bottomTile = this.tileMap.get(x, z+1);
   if (bottomTile)
      for (var i = 0; i < sideVerts; i++)
         preArr[i][sideVerts-1] = bottomTile.JSON.heightMap[i][0];

   return preArr;
}

TerrainHandler.prototype.calculateRoughnessFromSurroundings = function(x, z, min, max, sensitivity) {
   var roughSum = 0;
   var tileCount = 0;

   var topTile = this.tileMap.get(x, z-1);
   if (topTile) {
      roughSum += topTile.JSON.roughness;
      tileCount++;
   }

   var bottomTile = this.tileMap.get(x, z+1);
   if (bottomTile) {
      roughSum += bottomTile.JSON.roughness;
      tileCount++;
   }

   var leftTile = this.tileMap.get(x-1, z);

   if (leftTile) {
      roughSum += leftTile.JSON.roughness;
      tileCount++;
   }

   var rightTile = this.tileMap.get(x+1, z);
   if (rightTile) {
      roughSum += rightTile.JSON.roughness;
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

TerrainHandler.prototype.saveTile = function(x, z, tileJSON) {
   var name = "terrain_" + x + "_" + z;
   $.cookie(name, tileJSON, { expires: 7, path: '/' });
}

TerrainHandler.prototype.loadTile = function(x, z) {
   var name = "terrain_" + x + "_" + z;
   return $.cookie(name);
}

TerrainHandler.prototype.getTile = function(x, z) {
   return this.tileMap.get(x,z);
}

TerrainHandler.prototype.tileExists = function(x, z) {
   return this.tileMap.exists(x,z);
}

TerrainHandler.prototype.removeTile = function(x, z) {
   return this.tileMap.remove(x,z);
}

TerrainHandler.prototype.getTileWidth = function() {
   return this.tileWidth;
}

TerrainHandler.prototype.getXFirstNdx = function() {
   return this.tileMap.xFirstNdx;
}

TerrainHandler.prototype.getXLastNdx = function() {
   return this.tileMap.xLastNdx;
}

TerrainHandler.prototype.getYFirstNdx = function() {
   return this.tileMap.yFirstNdx;
}

TerrainHandler.prototype.getYLastNdx = function() {
   return this.tileMap.yLastNdx;
}