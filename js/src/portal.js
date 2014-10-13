
/*********************************** PUBLIC ***********************************/
var Portal = function(canvas) {
   this.canvas = canvas;
   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
   this.shaderProgram = null;
   this.models = null;
   this.system = null;

   this.gl ? this.setup() : alert("Unable to initialize WebGL. Your browser may not support it.");
}
/******************************************************************************/


Portal.prototype.setup = function() {
   this.initGLProperties();
   this.initShaders();
   this.initModels();
   this.initSystem();
   this.initControls();

   this.begin();
}

Portal.prototype.initGLProperties = function() {
   this.gl.clearColor(0.2, 0.3, 0.1, 1.0);                              // Set clear color to black, fully opaque
   this.gl.enable(this.gl.DEPTH_TEST);                                  // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL);                                   // Near things obscure far things
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.

   this.gl.viewportWidth = this.canvas.width;
   this.gl.viewportHeight = this.canvas.height;
}

Portal.prototype.initShaders = function() {
   this.shaderProgram = new ShaderProgram(this.gl, normalShaderPair);
}

Portal.prototype.initModels = function() {
   this.models = new ModelLibrary(this.gl);
}

Portal.prototype.initSystem = function() {
   this.system = new System();
}

Portal.prototype.initControls = function() {
   this.attachControls();
}

Portal.prototype.begin = function() {
   this.tick();
}

Portal.prototype.tick = function() {
   window.requestAnimationFrame(this.tick.bind(this));
   this.updateSystem();
   this.drawFrame();
}

Portal.prototype.updateSystem = function() {
   var timeNow = new Date().getTime();
   if (this.system.lastUpdateTime != 0) {
      var elapsed = timeNow - this.system.lastUpdateTime;

      this.updateCamera(elapsed);
      this.updateEntities(elapsed);
   }
   this.system.lastUpdateTime = timeNow;
}

Portal.prototype.updateEntities = function(elapsed) {
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

