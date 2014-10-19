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
   entities[0] = new Ground([0,-50,0], 0);
   entities.push(new WorldOfChuck([0, 0, -10], 0));
   for (var i = 1; i < 100; i++)
      entities.push(new Cube([randRange(-50, 50), randRange(-50, 50), randRange(-50, 50)], 0));
   for (var i = 100; i < 200; i++)
      entities.push(new Sphere([randRange(-50, 50), randRange(-50, 50), randRange(-50, 50)], 0));
   
   return entities;
}

Portal.prototype.updateWorld = function(elapsed) {
   this.updateEntities(elapsed);
}

Portal.prototype.updateEntities = function(elapsed) {
   for (var i = 1; i < this.entities.length; i++)
      this.entities[i].rotation += (2 * elapsed) / 1000.0;
}
