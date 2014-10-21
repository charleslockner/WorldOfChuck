/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var TerrainHandler = function(gl, tileWidth, tileHeight, reps) {
   this.gl = gl;

   this.generator = new TerrainGenerator(tileWidth, tileHeight, reps);
   this.tileMap = new TileMap(tileWidth);
}


TerrainHandler.prototype.createTile = function(x, z) {
   var preArr = this.generator.createEmptyArray();
   var sideVerts = this.generator.sideVerts;

   var leftTile = this.tileMap.get(x-1, z);
   var rightTile = this.tileMap.get(x+1, z);
   var topTile = this.tileMap.get(x, z-1);
   var bottomTile = this.tileMap.get(x, z+1);

   if (leftTile) {
      var lMap = leftTile.JSON.heightMap;
      for (var i = 0; i < sideVerts; i++)
         preArr[0][i] = lMap[sideVerts-1][i];
   }

   if (rightTile) {
      var rMap = rightTile.JSON.heightMap;
      for (var i = 0; i < sideVerts; i++)
         preArr[sideVerts-1][i] = rMap[0][i];
   }

   if (topTile) {
      var tMap = topTile.JSON.heightMap;
      for (var i = 0; i < sideVerts; i++)
         preArr[i][0] = tMap[i][sideVerts-1];
   }

   if (bottomTile) {
      var bMap = bottomTile.JSON.heightMap;
      for (var i = 0; i < sideVerts; i++)
         preArr[i][sideVerts-1] = bMap[i][0];
   }

   var tileJSON = this.generator.createRandom(preArr);
   var tileModel = ModelLoader.createFromJSON(this.gl, tileJSON);
   var tile = {
      JSON : tileJSON,
      model : tileModel
   }

   this.tileMap.put(x, z, tile);
}