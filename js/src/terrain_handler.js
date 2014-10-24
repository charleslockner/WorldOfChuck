/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var TerrainHandler = function(gl) {
   this.gl = gl;
   this.tileWidth = 1000; // have to mirror the server until we fix it
   this.tileMap = new TileMap();
   this.visibleMap = new TileMap();
   this.isLoading = false;
}

TerrainHandler.prototype.placeTile = function(x, z, visible) {
   this.setVisible(x, z, visible);
   var self = this;

   // if we don't have the tile in memory, go load it from the server
   if (!this.tileMap.exists(x, z)) {
      if (!this.isLoading) {
         this.isLoading = true;
         var path = "assets/models/terrain/" + x + "." + z + ".json"
         var tileModel = ModelLoader.load(this.gl, path, function(model) {
            self.tileMap.put(x, z, model);
            self.isLoading = false;
         });
      }
   }
}

TerrainHandler.prototype.isVisible = function(x, z) {
   return this.visibleMap.get(x, z);
}

TerrainHandler.prototype.setVisible = function(x, z, visible) {
   this.visibleMap.put(x, z, visible);
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