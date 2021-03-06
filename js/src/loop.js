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

   this.updateWorld(elapsed);    // in world.js
   this.updateCamera(elapsed);   // in camera.js

   this.lastUpdateTime = timeNow;
}

Portal.prototype.drawFrame = function() {
   this.renderForward ? this.renderWithForward() : this.renderWithDeferred();
}

Portal.prototype.renderWithForward = function() {
   this.gl.useProgram(this.shaders.forward.program);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   this.sendMatrices(this.shaders.forward.handles);
   this.sendLightsAndCamera(this.shaders.forward.handles);
   this.drawEntities(this.shaders.forward.handles);
}

Portal.prototype.renderWithDeferred = function() {
   this.deferredGeometryPass();
   this.deferredLightingPass();
}

Portal.prototype.deferredGeometryPass = function() {
   this.gl.useProgram(this.shaders.geometry.program);

   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.deferredFB);
   this.attachTextureOutputs();
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   this.sendMatrices(this.shaders.geometry.handles);
   this.drawEntities(this.shaders.geometry.handles);
}

Portal.prototype.deferredLightingPass = function() {
   this.gl.useProgram(this.shaders.lighting.program);

   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   this.sendDeferredLightingData();
   this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}

Portal.prototype.attachTextureOutputs = function() {
   this.dbExt.drawBuffersWEBGL([
      this.dbExt.COLOR_ATTACHMENT0_WEBGL,
      this.dbExt.COLOR_ATTACHMENT1_WEBGL,
      this.dbExt.COLOR_ATTACHMENT2_WEBGL,
      this.dbExt.COLOR_ATTACHMENT3_WEBGL
   ]);
}

Portal.prototype.sendMatrices = function(shaderHandles) {
   var viewM = this.makeViewMatrix();
   this.gl.uniformMatrix4fv(shaderHandles.uViewMatrix, false, viewM);

   var projectionM = this.makeProjectionMatrix();
   this.gl.uniformMatrix4fv(shaderHandles.uProjectionMatrix, false, projectionM);
}

Portal.prototype.drawEntities = function(shaderHandles) {
   for (var i = 0; i < this.entities.length; i++)
      this.entities[i].draw(this.gl, shaderHandles, this.models);
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

   this.sendLightsAndCamera(this.shaders.lighting.handles);
}

Portal.prototype.sendLightsAndCamera = function(shaderHandles) {
   this.gl.uniform3fv(shaderHandles.uCameraPosition, this.camera.position);
   this.gl.uniform3fv(shaderHandles.uLights, this.lights);
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