
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


var vbo;
var nbo;
var ibo;

Portal.prototype.initShaderHandles = function() {
   this.shaderProgram.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
   this.gl.enableVertexAttribArray(this.shaderProgram.aVertexPosition);

   this.shaderProgram.aVertexNormal = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
   this.gl.enableVertexAttribArray(this.shaderProgram.aVertexNormal);

   this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
   this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
}

Portal.prototype.initGeometry = function() {
   this.initShaderHandles();

   // vertex positions

   vbo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
   var vertices = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
   ];

   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
   vbo.itemSize = 3;
   vbo.numItems = 24;


   // vertex normals

   nbo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
   var normals = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
   ];

   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
   nbo.itemSize = 3;
   nbo.numItems = 24;


   // indices to vertices

   ibo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
   var indices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
   ];
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
   ibo.itemSize = 1;
   ibo.numItems = 36;
}


Portal.prototype.drawScene = function() {
   this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

   mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, pMatrix);

   mat4.identity(mvMatrix);

   //mat4.translate(mvMatrix, [-1.5, 0.0, -8.0]);

   // var angle = 0.3;
   // mat4.rotate(mvMatrix, angle, [0, 1, 0]);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, vbo.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nbo);
   this.gl.vertexAttribPointer(this.shaderProgram.aVertexNormal, nbo.itemSize, this.gl.FLOAT, false, 0, 0);

   this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
   this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);

   this.gl.drawArrays(this.gl.TRIANGLES, 0, vbo.numItems);
}




