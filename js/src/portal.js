var rCube = 0.0;

/*********************************** PUBLIC ***********************************/
function Portal(canvas) {
   this.canvas = canvas;
   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
   this.shaderProgram = null;

   this.gl ? this.setup() : alert("Unable to initialize WebGL. Your browser may not support it.");
}
/******************************************************************************/


Portal.prototype.setup = function() {
   this.initGLProperties();
   this.initControls();
   this.initShaders();
   this.initGeometry();

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

Portal.prototype.initControls = function() {
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

Portal.prototype.initShaders = function() {
   this.shaderProgram = new ShaderProgram(this.gl, normalShaderPair);
}

Portal.prototype.initGeometry = function() {
   // vertex positions
   cubeModel.vbo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeModel.vbo);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cubeModel.vertices), this.gl.STATIC_DRAW);

   // vertex normals
   cubeModel.nbo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeModel.nbo);
   this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cubeModel.normals), this.gl.STATIC_DRAW);

   // indices to vertices
   cubeModel.ibo = this.gl.createBuffer();
   this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeModel.ibo);
   this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeModel.indices), this.gl.STATIC_DRAW);
}

