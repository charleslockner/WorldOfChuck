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
   this.model = "question"; // indicates that model doesn't exist
}

var Cube = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "cube";
};

Cube.prototype = new Entity();
Cube.prototype.constructor = Cube;

var Sphere = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "sphere";
};

Sphere.prototype = new Entity();
Sphere.prototype.constructor = Sphere;

var Pillar = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.model = "pillar";
};

Pillar.prototype = new Entity();
Pillar.prototype.constructor = Pillar;
