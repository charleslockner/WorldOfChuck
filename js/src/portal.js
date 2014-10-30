/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var Portal = function(canvas) {
   this.canvas = canvas;

   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
   if (!this.gl) {
      alert("WebGL not supported. Please use a desktop Chrome browser.");
      return null;
   }

   var success = this.attachExtensions();
   if (!success)
      return null;

   // Listing here all the instance variables that belong to Portal
   this.shaders = null;
   this.deferredFB = null;
   this.models = null;
   this.entities = null;
   this.controls = null;
   this.camera = null;
   this.shaderProgram = null;
   this.lastUpdateTime = 0;
   this.NEAR_DISTANCE = 0.1;
   this.FAR_DISTANCE = 10000;

   // Rev-up this icicle clam!!
   this.setup();
}

Portal.prototype.attachExtensions = function() {
   this.dbExt = this.gl.getExtension('WEBGL_draw_buffers');
   if (!this.dbExt) {
      alert("WEBGL_draw_buffers not supported");
      return false;
   }

   this.floatExt = this.gl.getExtension("OES_texture_float");
   if (!this.floatExt) {
      alert("OES_texture_float not supported");
      return false;
   }

   this.halfFloatExt = this.gl.getExtension("OES_texture_half_float");
   if (!this.halfFloatExt) {
      alert("OES_texture_float not supported");
      return false;
   }

   this.depthExt = this.gl.getExtension("WEBGL_depth_texture"); // Or browser-appropriate prefix
   if (!this.depthExt) {
      alert("WEBGL_depth_texture not supported");
      return false;
   }

   return true;
}

Portal.prototype.setup = function() {
   this.initGLProperties();         // Look down below o.O
   this.initModels();               // models.js
   this.initWorld();                // world.js (initializes entities & lights)
   this.initControls();             // controls.js
   this.initCamera();               // camera.js
   this.initDeferredFramebuffer();  // deferred.js (initializes the deferred framebuffer and textures)
   this.initShaders();              // shaders.js (initializes deferred shading buffers and installs shaders)

   this.loop();         // loop.js (Begin main loop)
}

Portal.prototype.initGLProperties = function() {
   this.gl.clearColor(0.05, 0.05, 0.10, 1.0);
   this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
}


