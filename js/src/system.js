var System = function() {
   return {
      lastUpdateTime : 0,
      entities : [1000],
      camera : {
         position : vec3.fromValues(0.0, 1.0, 10.0),
         direction : vec3.fromValues(0.0, 0.0, -1.0),
         up : vec3.fromValues(0.0, 1.0, 0.0),
         pitch : 0.0,
         yaw : -PI / 2
      },
      controls : {
         forwardPressed : false,
         backwardPressed : false,
         leftPressed : false,
         rightPressed : false,

         cursorXDelta : 0,
         cursorYDelta : 0
      }
   }
};
