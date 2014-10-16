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