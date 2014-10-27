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
      this.entities[i].draw(this.gl, this.shaderProgram, this.models);
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

   this.gl.uniform3fv(this.shaderProgram.uCameraPosition, this.camera.position);

   var lights = [ -20.0, -10.0, -4.0,
                  1.0, -0.2, -0.8,
                  0.8, 0.2, 1.0,
                  150, 50.0, 15,

                  10,20,35,
                  -0.8, 0.1, -0.5,
                  1.0, 0.8, 0.5,
                  100, 50.0, 15,

                  -15,30,5,
                  -0.8, 0.1, -0.5,
                  0.2, 0.9, 0.7,
                  100, 50.0, 15, ];
   this.gl.uniform3fv(this.shaderProgram.uLights, lights);
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