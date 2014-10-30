/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

Portal.prototype.initDeferredFramebuffer = function() {
   // create textures to store the render buffers
   this.renderTextures = [
      this.createFloatTexture(),       // positions
      this.createFloatTexture(),       // normals
      this.createRGBATexture(),        // colors
      this.createDepthTexture()        // depth
   ]; 

   // create a frame buffer
   this.deferredFB = this.gl.createFramebuffer();
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.deferredFB); // the next draw calls will operate on this framebuffer

   // attaching the textures to the frame buffer
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.dbExt.COLOR_ATTACHMENT0_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[0], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.dbExt.COLOR_ATTACHMENT1_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[1], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.dbExt.COLOR_ATTACHMENT2_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[2], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.renderTextures[3], 0);

   // set everything back to defaults
   this.gl.bindTexture(this.gl.TEXTURE_2D, null);
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
}

Portal.prototype.createRGBATexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.setTextureParameters();
   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
                      0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
   return tex;
}

Portal.prototype.createFloatTexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.setTextureParameters();
   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
                      0, this.gl.RGBA, this.gl.FLOAT, null);
   return tex;
}

Portal.prototype.createHalfFloatTexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.setTextureParameters();
   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
                      0, this.gl.RGBA, this.gl.FLOAT, null); // SHOULD BE HALF_FLOAT, but doesn't work...
   return tex;
}

Portal.prototype.createDepthTexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.setTextureParameters();

   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 
                      0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);
   return tex;
}

Portal.prototype.setTextureParameters = function() {
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
}

