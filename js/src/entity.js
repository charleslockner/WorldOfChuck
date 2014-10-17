/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

// Super-class
var Entity = function(pos, rot) {
   this.position = pos;
   this.rotation = rot;
   this.model = null;
}

var WorldOfChuck = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "worldofchuck";
};

// Make WorldOfChuck a subclass of Entity
WorldOfChuck.prototype = new Entity();
WorldOfChuck.prototype.constructor = WorldOfChuck;

var Cube = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "cube";
};

// Make Cube a subclass of Entity
Cube.prototype = new Entity();
Cube.prototype.constructor = Cube;

var Sphere = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "sphere";
};

// Make Sphere a subclass of Entity
Sphere.prototype = new Entity();
Sphere.prototype.constructor = Sphere;

var Pillar = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "pillar";
};

// Make Pillar a subclass of Entity
Pillar.prototype = new Entity();
Pillar.prototype.constructor = Pillar;
