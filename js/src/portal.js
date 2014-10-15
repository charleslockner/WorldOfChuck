
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
   this.gl.clearColor(0, 0, 0, 1.0);                              // Set clear color to black, fully opaque
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
   this.loadModels();
}

Portal.prototype.initSystem = function() {
   this.system = new System();
   this.initEntities();
}

Portal.prototype.initEntities = function() {
   this.system.entities[0] = new Cube();
   this.system.entities[1] = new Pillar();
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
   this.system.entities[0].rotation += (2 * elapsed) / 1000.0;
   this.system.entities[1].rotation += (1.5 * elapsed) / 1000.0;
}


Portal.prototype.drawFrame = function() {
   this.updateViewport();
   this.sendEntityIndependantShaderData();

   this.drawEntity(this.system.entities[0]);
   this.drawEntity(this.system.entities[1]);
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
   var model = this.models[entity.model];

   if (model) {
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
}

Portal.prototype.makeModelMatrix = function(entity) {
   var modelM = mat4.create();
   // mat4.identity(modelM); // Set to identity
   mat4.translate(modelM, modelM, vec3.fromValues(entity.position.x, entity.position.y, entity.position.z));
   mat4.rotate(modelM, modelM, entity.rotation, vec3.fromValues(0.0, 1.0, 0.0));
   mat4.scale(modelM, modelM, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));

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

