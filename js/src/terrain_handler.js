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
}

TerrainHandler.prototype.createTile = function(x, z) {
   var preArr = this.createMapFromSurroundings(x, z);
   var tileJSON = this.generator.createRandom(preArr);
   var tileModel = ModelLoader.createFromJSON(this.gl, tileJSON);

   var tile = {
      JSON : tileJSON,
      model : tileModel
   }

   this.tileMap.put(x, z, tile);
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