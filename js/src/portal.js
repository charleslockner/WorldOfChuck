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
   this.ext = this.gl.getExtension('WEBGL_draw_buffers');

   if (!this.gl) {
      alert("Please use Chrome, if not that, then Firefox.");
      return null;
   }

   if (!this.ext) {
      alert("WEBGL_draw_buffers not supported");
      return null;
   }

   // Listing here all the instance variables that belong to Portal
   this.shaders = null;
   this.models = null;
   this.entities = null;
   this.controls = null;
   this.camera = null;
   this.shaderProgram = null;
   this.lastUpdateTime = 0;
   this.NEAR_DISTANCE = 0.1;
   this.FAR_DISTANCE = 10000;

   // Rev-up this icicle clam!!
   this.setup()
}

Portal.prototype.setup = function() {
   this.initGLProperties();
   this.initModels();   // models.js
   this.initWorld();    // world.js (initializes entities & lights)
   this.initControls(); // controls.js
   this.initCamera();   // camera.js
   this.initShaders();  // shaders.js
   this.initTextureFramebuffer();

   var self = this;

   // ModelLoader.loadImage(this.gl, "assets/textures/brick.png", function(texture) {
   //    self.testTexture = texture;
   //    self.loop();
   // });

   this.loop();         // loop.js (Begin main loop)
}

Portal.prototype.initGLProperties = function() {
   this.gl.clearColor(0, 0, 0, 1.0);
   this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
}

Portal.prototype.createEmptyTexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
   
   // allocate space to draw texture to
   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
                      0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

   return tex;
}

Portal.prototype.createRenderbuffer = function() {
   var renderbuffer = this.gl.createRenderbuffer();
   this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
   this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
   return renderbuffer;
}

Portal.prototype.initTextureFramebuffer = function() {
   // create frame buffer
   this.rttFramebuffer = this.gl.createFramebuffer();
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer); // the next draw calls will operate on this framebuffer

   // create textures to store the render buffers
   this.renderTextures = [
      this.createEmptyTexture(),
      this.createEmptyTexture(),
      this.createEmptyTexture(),
      this.createEmptyTexture()
   ]; 

   // attaching the color storage
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT0_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[0], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT1_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[1], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT2_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[2], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT3_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[3], 0);

   // create and attach storage for depth information
   var renderbuffer = this.createRenderbuffer();
   this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);

   // set everything back to defaults
   this.gl.bindTexture(this.gl.TEXTURE_2D, null);
   this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
}
