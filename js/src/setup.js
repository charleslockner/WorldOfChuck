
function Portal(canvas) {
   this.canvas = canvas;
   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
   this.shaderProgram = null;

   if (!this.gl)
      alert("Unable to initialize WebGL. Your browser may not support it.");
   else
      this.setup();
}

Portal.prototype.setup = function() {
   this.initGLProperties();
   this.shaderProgram = new ShaderProgram(this.gl, normalShaderPair);

   this.initGeometry();
   this.drawScene();

   this.addEventListeners();

   // this.startMainLoop();
}

Portal.prototype.initGLProperties = function() {
   this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                              // Set clear color to black, fully opaque
   this.gl.enable(this.gl.DEPTH_TEST);                                  // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL);                                   // Near things obscure far things
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.

   this.gl.viewportWidth = this.canvas.width;
   this.gl.viewportHeight = this.canvas.height;
}

Portal.prototype.addEventListeners = function() {
   // $(window).resize(this, this.onPortalResize);
}

// Portal.prototype.onPortalResize = function(e) {
//    fitPortalToWindow(e.data.gl, e.data.canvas);
// }

// function fitPortalToWindow(gl, canvas) {
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;
//    gl.viewportWidth = canvas.width;
//    gl.viewportHeight = canvas.height;
// }











var mvMatrix = mat4.create();
var pMatrix = mat4.create();

Portal.prototype.setMatrixUniforms = function () {
   this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
   this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
}



var triangleVertexPositionBuffer;

Portal.prototype.initGeometry = function() {
   triangleVertexPositionBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

   var vertices = [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
   ];

   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
   triangleVertexPositionBuffer.itemSize = 3;
   triangleVertexPositionBuffer.numItems = 3;

   squareVertexPositionBuffer = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, squareVertexPositionBuffer);
   vertices = [
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
   ];

   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
   squareVertexPositionBuffer.itemSize = 3;
   squareVertexPositionBuffer.numItems = 4;
}


Portal.prototype.drawScene = function() {
   this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, pMatrix);

   mat4.identity(mvMatrix);

   // var translation = vec3.create();
   // vec3.set (translation, -1.5, 0.0, -7.0);
   // mat4.translate (mvMatrix, mvMatrix, translation);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
   this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
   this.setMatrixUniforms();
   this.gl.drawArrays(this.gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}




