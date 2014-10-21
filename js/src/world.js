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
   // entities[0] = new WorldOfChuck([0, 0, -10], 0);
   for (var i = 1; i < 200; i++)
      entities.push(new Cube([randRange(-50, 50), randRange(-50, 50), randRange(-50, 50)], 0));
   
   return entities;
}

Portal.prototype.updateWorld = function(elapsed) {
   this.updateEntities(elapsed);
}

Portal.prototype.updateEntities = function(elapsed) {
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
