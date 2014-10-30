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
      alert("Your browser/device does not support WebGL. Use desktop Chrome to view this site.");
      return null;
   }

   var success = this.attachExtensions();
   if (!success) {
      alert("Your browser/device does not support a WebGL extension. Use desktop Chrome to view this site.");
      return null;
   }

   // Listing here all the instance variables that belong to Portal
   this.shaders = null;
   this.deferredFB = null;
   this.models = null;
   this.entities = null;
   this.controls = null;
   this.camera = null;
   this.shaderProgram = null;
   this.renderForward = false;
   this.lastUpdateTime = 0;
   this.NEAR_DISTANCE = 0.1;
   this.FAR_DISTANCE = 10000;

   // Rev-up this icicle clam!!
   this.setup();
}

Portal.prototype.attachExtensions = function() {
   this.dbExt = this.gl.getExtension('WEBGL_draw_buffers');
   if (!this.dbExt) {
      console.log("WEBGL_draw_buffers not supported");
      return false;
   }

   this.floatExt = this.gl.getExtension("OES_texture_float");
   if (!this.floatExt) {
      console.log("OES_texture_float not supported");
      return false;
   }

   this.halfFloatExt = this.gl.getExtension("OES_texture_half_float");
   if (!this.halfFloatExt) {
      console.log("OES_texture_half_float not supported");
      return false;
   }

   this.depthExt = this.gl.getExtension("WEBGL_depth_texture"); // Or browser-appropriate prefix
   if (!this.depthExt) {
      console.log("WEBGL_depth_texture not supported");
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
   this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
   this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
   this.gl.enable(this.gl.CULL_FACE)  // Enable backface culling
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
}


