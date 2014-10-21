/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initWorld = function() {
   this.entities = this.placeEntities();
}

Portal.prototype.placeEntities = function() {
   var entities = [1000];
   entities[0] = new Terrain([0,0,0], 0);
   entities[1] = new WorldOfChuck([0, 0, -10], 0);
   for (var i = 0; i < 200; i++)
      entities.push(new Cube([randRange(-50, 50), randRange(-50, 50), randRange(-50, 50)], 0));
   
   return entities;
}

Portal.prototype.updateWorld = function(elapsed) {
   this.updateEntities(elapsed);
}

Portal.prototype.updateEntities = function(elapsed) {
   this.updateTerrain(elapsed);

   // this.entities[0].rotation += -.2 * elapsed / 1000.0;

   this.entities[1].rotation += -1.5 * elapsed / 1000.0;
   for (var i = 1; i < this.entities.length; i++) {
      if (i % 5 == 0)
         this.entities[i].rotation += 5 * elapsed / 1000.0;
      else if (i % 5 == 1)
         this.entities[i].rotation += -3 * elapsed / 1000.0;
      else if (i % 5 == 2)
         this.entities[i].rotation += 8 * elapsed / 1000.0;
      else if (i % 5 == 3)
         this.entities[i].rotation += -2 * elapsed / 1000.0;
      else if (i % 5 == 4)
         this.entities[i].rotation += 18 * elapsed / 1000.0;
   }
}

Portal.prototype.updateTerrain = function(elapsed) {
   var curX = Math.floor(this.camera.position[0] / this.models.tileWidth + 0.5);
   var curZ = Math.floor(this.camera.position[2] / this.models.tileWidth + 0.5);

   var xKeepF = curX - 1;
   var xKeepL = curX + 1;
   var zKeepF = curZ - 1;
   var zKeepL = curZ + 1;

   var xF = this.models.terrainHandler.tileMap.xFirstNdx;
   var xL = this.models.terrainHandler.tileMap.xLastNdx;
   var zF = this.models.terrainHandler.tileMap.yFirstNdx;
   var zL = this.models.terrainHandler.tileMap.yLastNdx;

   // create tiles
   for (var x = xKeepF; x <= xKeepL; x++)
      for (var z = zKeepF; z <= zKeepL; z++)
         if (!this.models.terrainHandler.tileMap.exists(x, z)) {
            // console.log("added tile (" + x + ", " + z + ")");
            this.models.terrainHandler.createTile(x,z);
            console.log(this.models.terrainHandler.tileMap.toString());
         }

   // remove WEST tiles
   for (var x = xF; x < xKeepF; x++)
      for (var z = zF; z <= zL; z++)
         if (this.models.terrainHandler.tileMap.exists(x,z)) {
            // console.log("removed west tile (" + x + ", " + z + ")");
            this.models.terrainHandler.removeTile(x, z);
            console.log(this.models.terrainHandler.tileMap.toString());
         }

   // remove EAST tiles
   for (var x = xKeepL+1; x <= xL; x++)
      for (var z = zF; z <= zL; z++)
         if (this.models.terrainHandler.tileMap.exists(x,z)) {
            // console.log("removed east tile (" + x + ", " + z + ")");
            this.models.terrainHandler.removeTile(x, z);
            console.log(this.models.terrainHandler.tileMap.toString());
         }

   // remove SOUTH tiles
   for (var x = xKeepF; x <= xKeepL; x++)
      for (var z = zF; z < zKeepF; z++)
         if (this.models.terrainHandler.tileMap.exists(x,z)) {
            // console.log("removed south tile (" + x + ", " + z + ")");
            this.models.terrainHandler.removeTile(x, z);   
            console.log(this.models.terrainHandler.tileMap.toString());
         }

   // remove NORTH tiles
   for (var x = xKeepF; x <= xKeepL; x++)
      for (var z = zKeepL+1; z < zL; z++)
         if (this.models.terrainHandler.tileMap.exists(x,z)) {
            // console.log("removed north tile (" + x + ", " + z + ")");
            this.models.terrainHandler.removeTile(x, z);  
            console.log(this.models.terrainHandler.tileMap.toString());
         }
}

