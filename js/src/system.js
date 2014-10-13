Portal.prototype.begin = function() {
   this.tick();
}

Portal.prototype.tick = function() {
   window.requestAnimationFrame(this.tick.bind(this));
   this.updateState();
   this.drawFrame();
}

var lastTime = 0;

Portal.prototype.updateState = function() {
   var timeNow = new Date().getTime();
   if (lastTime != 0) {
      var elapsed = timeNow - lastTime;
      rCube += (2 * elapsed) / 1000.0;
   }
   lastTime = timeNow;
}

Portal.prototype.drawFrame = function() {
   this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   var modelM = this.makeModelMatrix();
   var viewM = this.makeViewMatrix();
   var projectionM = this.makeProjectionMatrix();

   this.gl.uniformMatrix4fv(this.shaderProgram.uModelMatrix, false, modelM);
   this.gl.uniformMatrix4fv(this.shaderProgram.uViewMatrix, false, viewM);
   this.gl.uniformMatrix4fv(this.shaderProgram.uProjectionMatrix, false, projectionM);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeModel.vbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeModel.nbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeModel.ibo);

   this.gl.drawElements(this.gl.TRIANGLES, 3 * cubeModel.numTriangles, this.gl.UNSIGNED_SHORT, 0);
}

Portal.prototype.makeModelMatrix = function() {
   // mat4 translateM = glm::translate(MAT4_ID, position(vec3));
   // mat4 scaleM = glm::scale(MAT4_ID, scale(vec3));
   // mat4 rotateM = glm::rotate(MAT4_ID, angle, axis(vec3));
   // mat4 modelM = Transl * Rot * Scale;
   var modelM = mat4.create();

   mat4.rotate(modelM, modelM, rCube, vec3.fromValues(1.0, 3.0, 0.0));
   return modelM;
}

Portal.prototype.makeViewMatrix = function() {
   var viewM = mat4.create();

   var eye = vec3.fromValues(0.0, 5.0, 10.0);
   var target = vec3.fromValues(0.0, 0.0, 0.0);
   var up = vec3.fromValues(0.0, 1.0, 0.0);
   mat4.lookAt(viewM, eye, target, up);

   return viewM;
}

Portal.prototype.makeProjectionMatrix = function() {
   var projectionM = mat4.create();

   var aspect = this.gl.viewportWidth / this.gl.viewportHeight;
   mat4.perspective(projectionM, 1.0, aspect, 0.1, 100.0);

   return projectionM;
}