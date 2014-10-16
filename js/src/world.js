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
   entities[0] = new Cube([0,0,-10], 0);
   entities[1] = new Cube([0,0,10], 0);
   entities[2] = new Sphere([-10,0,0], 0);
   entities[3] = new Sphere([10,0,0], 0);

   return entities;
}

Portal.prototype.updateWorld = function(elapsed) {
   this.updateEntities(elapsed);
}

Portal.prototype.updateEntities = function(elapsed) {
   for (var i = 0; i < this.entities.length; i++)
      this.entities[i].rotation += (2 * elapsed) / 1000.0;
}
