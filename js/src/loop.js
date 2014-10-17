/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

Portal.prototype.loop = function() {
   this.updateState();
   if (this.shaderProgram) // We may not have returned from the glsl load call
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
   this.updateViewport();
   this.sendEntityIndependantShaderData();

   for (var i = 0; i < this.entities.length; i++)
      this.drawEntity(this.entities[i]);
}

Portal.prototype.updateViewport = function() {
   this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}

Portal.prototype.sendEntityIndependantShaderData = function() {
   var viewM = this.makeViewMatrix();
   this.gl.uniformMatrix4fv(this.shaderProgram.uViewMatrix, false, viewM);

   var projectionM = this.makeProjectionMatrix();
   this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrix, false, projectionM);
}

Portal.prototype.drawEntity = function(entity) {
   var model = this.models[entity.model] || this.models.unknown;

   var flags = 1; // flat shade the object
   this.gl.uniform1i(this.shaderProgram.uFlags, flags);

   var modelM = this.makeModelMatrix(entity);
   this.gl.uniformMatrix4fv(this.shaderProgram.uModelMatrix, false, modelM);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.vbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.nbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, model.ibo);

   this.gl.drawElements(this.gl.TRIANGLES, 3 * model.faces, this.gl.UNSIGNED_SHORT, 0);
}

Portal.prototype.makeModelMatrix = function(entity) {
   var modelM = mat4.create();
   // mat4.identity(modelM); // Set to identity
   mat4.translate(modelM, modelM, vec3.fromValues(entity.position[0], entity.position[1], entity.position[2]));
   mat4.rotate(modelM, modelM, entity.rotation, vec3.fromValues(0.0, 1.0, 0.0));
   // mat4.scale(modelM, modelM, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));

   return modelM;
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
   mat4.perspective(projectionM, 1.0, aspect, 0.1, 100.0);

   return projectionM;
}