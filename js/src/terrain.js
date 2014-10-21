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
   // var preArr = new Float32Array(); // var orient = this.models.terrainGenerator.WEST;
   var tileJSON = this.generator.createRandom(null, null);
   var tileModel = ModelLoader.createFromJSON(this.gl, tileJSON);
   var tile = {
      JSON : tileJSON,
      model : tileModel
   }

   this.tileMap.put(x, z, tile);
}