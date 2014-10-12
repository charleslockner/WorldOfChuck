var EnhancedWebGL = {
   init : function(canvas) {
      var gl = null;

      try {
         // Try to grab the standard context. If it fails, fallback to experimental.
         gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      }
      catch(e) {}

      // If we don't have a GL context, give up now
      if (!gl) {
         alert("Unable to initialize WebGL. Your browser may not support it.");
         gl = null;
      }

      return gl;
   }
}

