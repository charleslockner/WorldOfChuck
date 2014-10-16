/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var Cube = function(pos, rot) {
   return {
      position :
      {
         x : pos[0],
         y : pos[1],
         z : pos[2]
      },
      rotation : rot,
      model : "cube"
   }
};

var Sphere = function(pos, rot) {
   return {
      position :
      {
         x : pos[0],
         y : pos[1],
         z : pos[2]
      },
      rotation : rot,
      model : "sphere"
   }
};

var Pillar = function(pos, rot) {
   return {
      position :
      {
         x : pos[0],
         y : pos[1],
         z : pos[2]
      },
      rotation : rot,
      model : "pillar"
   }
};