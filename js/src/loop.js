/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

Portal.prototype.loop = function() {
   this.updateState();

   if (this.shaders.geometry.program && this.shaders.lighting.program) // We may not have returned from the glsl load call
      this.drawFrame();

   window.requestAnimationFrame(this.loop.bind(this));
}

Portal.prototype.updateState = function() {
   var timeNow = new Date().getTime();
   var elapsed = timeNow - this.lastUpdateTime;

   this.updateWorld(elapsed);
   this.updateCamera(elapsed);

   this.lastUpdateTime = timeNow;
}

Portal.prototype.drawFrame = function() {
   this.deferredGeometryPass();
   this.deferredLightingPass();
}

Portal.prototype.deferredGeometryPass = function() {
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.deferredFB);
   this.gl.useProgram(this.shaders.geometry.program);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   // attach textures to shader output
   this.ext.drawBuffersWEBGL([
      this.ext.COLOR_ATTACHMENT0_WEBGL,
      this.ext.COLOR_ATTACHMENT1_WEBGL,
      this.ext.COLOR_ATTACHMENT2_WEBGL,
      this.ext.COLOR_ATTACHMENT3_WEBGL
   ]);

   this.sendIndependentGeometryData();
   this.drawEntities();
}

Portal.prototype.sendIndependentGeometryData = function() {
   var viewM = this.makeViewMatrix();
   this.gl.uniformMatrix4fv(this.shaders.geometry.handles.uViewMatrix, false, viewM);

   var projectionM = this.makeProjectionMatrix();
   this.gl.uniformMatrix4fv(this.shaders.geometry.handles.uProjectionMatrix, false, projectionM);
}

Portal.prototype.drawEntities = function() {
   for (var i = 0; i < this.entities.length; i++)
      this.entities[i].draw(this.gl, this.shaders.geometry, this.models);
}

Portal.prototype.deferredLightingPass = function() {
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
   this.gl.useProgram(this.shaders.lighting.program);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   this.sendDeferredLightingData();
   this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}


Portal.prototype.sendDeferredLightingData = function() {
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.shaders.lighting.vbo);
   this.gl.enableVertexAttribArray(this.shaders.lighting.handles.aClipPosition);
   this.gl.vertexAttribPointer(this.shaders.lighting.handles.aClipPosition, 2, this.gl.FLOAT, false, 0, 0);

   this.gl.activeTexture(this.gl.TEXTURE0);
   this.gl.bindTexture(this.gl.TEXTURE_2D, this.renderTextures[0]);
   this.gl.uniform1i(this.shaders.lighting.handles.uPositionTex, 0);

   this.gl.activeTexture(this.gl.TEXTURE1);
   this.gl.bindTexture(this.gl.TEXTURE_2D, this.renderTextures[1]);
   this.gl.uniform1i(this.shaders.lighting.handles.uNormalTex, 1);

   this.gl.activeTexture(this.gl.TEXTURE2);
   this.gl.bindTexture(this.gl.TEXTURE_2D, this.renderTextures[2]);
   this.gl.uniform1i(this.shaders.lighting.handles.uColorTex, 2);

   this.gl.uniform3fv(this.shaders.lighting.handles.uCameraPosition, this.camera.position);
   this.gl.uniform3fv(this.shaders.lighting.handles.uLights, this.lights);
}


Portal.prototype.makeViewMatrix = function() {
   var viewM = mat4.create();

   var target = {}; vec3.add(target, this.camera.position, this.camera.direction)
   mat4.lookAt(viewM, this.camera.position, target, this.camera.up);

   return viewM;
}

Portal.prototype.makeProjectionMatrix = function() {
   var projectionM = mat4.create();

   var aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
   mat4.perspective(projectionM, 1.0, aspect, this.NEAR_DISTANCE, this.FAR_DISTANCE);

   return projectionM;
}