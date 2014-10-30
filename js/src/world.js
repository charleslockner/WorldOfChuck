/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initWorld = function() {
   this.initEntities();
   this.initLights();
}

Portal.prototype.initEntities = function() {
   var ents = [100000];
   // entities[0] = new Terrain([0,0,0], 0);
   ents[0] = new Cube([0, 0, -10], 0);
   for (var i = 0; i < 2000; i++)
      ents.push(new Cube([randRange(-50, 50), randRange(-50, 50), randRange(-50, 50)], 0));
   
   this.entities = ents;
}

Portal.prototype.initLights = function() {
   this.lights = [
      15.0, 0.0, -15.0,
      1.0, -0.2, -0.8,
      1.0, 0.0, 1.0,
      400, 50.0, 15,

      -15.0, 15.0, 0.0,
      -0.8, 0.1, -0.5,
      0.0, 1.0, 1.0,
      400, 50.0, 15,

      0.0, -15.0, 15.0,
      -0.8, 0.1, -0.5,
      1.0, 1.0, 0.0,
      600, 50.0, 15
   ];
}

Portal.prototype.updateWorld = function(elapsed) {
   this.updateEntities(elapsed);
}

Portal.prototype.updateEntities = function(elapsed) {
   for (var i = 0; i < this.entities.length; i++)
      this.entities[i].update(elapsed);
}

