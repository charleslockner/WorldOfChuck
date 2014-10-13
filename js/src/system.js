Portal.prototype.begin = function() {
   this.tick();
}

Portal.prototype.tick = function() {
   window.requestAnimationFrame(this.tick.bind(this));
   this.updateSystem();
   this.drawFrame();
}

var lastTime = 0;

Portal.prototype.updateSystem = function() {
   var timeNow = new Date().getTime();
   if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      this.updateCamera(elapsed);
      this.updateObjects(elapsed);
   }
   lastTime = timeNow;
}

Portal.prototype.updateCamera = function(elapsed) {
   var camSpeed = 10;
   if (this.system.controls.leftPressed) {
      var trans = {};
      vec3.normalize(trans, this.system.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.system.camera.up);
      vec3.sub(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.rightPressed) {
      var trans = {};
      vec3.normalize(trans, this.system.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.system.camera.up);
      vec3.add(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.forwardPressed) {
      var trans = {};
      vec3.scale(trans, this.system.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.add(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.backwardPressed) {
      var trans = {};
      vec3.scale(trans, this.system.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.sub(this.system.camera.position, this.system.camera.position, trans);
   }

   this.aimCamera(elapsed);
}

Portal.prototype.aimCamera = function(elapsed) {

   if (this.system.controls.cursorXDelta || this.system.controls.cursorXDelta) {

      var pitch = this.system.camera.pitch;
      var yaw = this.system.camera.yaw;

      pitch = pitch - this.system.controls.cursorYDelta * .01;
      yaw = yaw + this.system.controls.cursorXDelta * .01;

      if (pitch >= PITCH_LIMIT)
         pitch = PITCH_LIMIT;
      if (pitch <= -PITCH_LIMIT)
         pitch = -PITCH_LIMIT;
      if (yaw >= 2.0 * PI)
         yaw -= 2.0 * PI;
      if (yaw < 0)
         yaw += 2.0 * PI;

      var tx = Math.cos(pitch) * Math.cos(yaw);
      var ty = Math.sin(pitch);
      var tz = Math.cos(pitch) * Math.cos(PI/2 - yaw);

      this.system.camera.pitch = pitch;
      this.system.camera.yaw = yaw;
      this.system.camera.direction = vec3.fromValues(tx, ty, tz);

      this.system.controls.cursorXDelta = 0;
      this.system.controls.cursorYDelta = 0;
   }
}



Portal.prototype.updateObjects = function(elapsed) {
   this.system.rCube += (2 * elapsed) / 1000.0;
}


Portal.prototype.drawFrame = function() {
   this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   var modelM = this.makeModelMatrix();
   var viewM = this.makeViewMatrix();
   var projectionM = this.makeProjectionMatrix();

   this.gl.uniformMatrix4fv(this.shaderProgram.uModelMatrix, false, modelM);
   this.gl.uniformMatrix4fv(this.shaderProgram.uViewMatrix, false, viewM);
   this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrix, false, projectionM);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.models.cube.vbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.models.cube.nbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.models.cube.ibo);

   this.gl.drawElements(this.gl.TRIANGLES, 3 * this.models.cube.numTriangles, this.gl.UNSIGNED_SHORT, 0);
}

Portal.prototype.makeModelMatrix = function() {
   // mat4 translateM = glm::translate(MAT4_ID, position(vec3));
   // mat4 scaleM = glm::scale(MAT4_ID, scale(vec3));
   // mat4 rotateM = glm::rotate(MAT4_ID, angle, axis(vec3));
   // mat4 modelM = Transl * Rot * Scale;
   var modelM = mat4.create();

   mat4.rotate(modelM, modelM, this.system.rCube, vec3.fromValues(1.0, 3.0, 0.0));
   return modelM;
}

Portal.prototype.makeViewMatrix = function() {
   var viewM = mat4.create();

   var target = {}; vec3.add(target, this.system.camera.position, this.system.camera.direction)
   mat4.lookAt(viewM, this.system.camera.position, target, this.system.camera.up);

   return viewM;
}

Portal.prototype.makeProjectionMatrix = function() {
   var projectionM = mat4.create();

   var aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
   mat4.perspective(projectionM, 1.0, aspect, 0.1, 100.0);

   return projectionM;
}