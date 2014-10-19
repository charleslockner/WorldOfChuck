/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initShaders = function() {
   var self = this;

   this.createShaderProgram("shaders/normal.vert.glsl", "shaders/normal.frag.glsl", function(program) {
      self.shaderProgram = program;
      self.setupHandles(self.shaderProgram);
      self.gl.useProgram(self.shaderProgram);
   });
}

Portal.prototype.createShaderProgram = function(vsPath, fsPath, callback) {
   var self = this;

   $.get(vsPath, function(vsString) {
      console.log(vsPath + " loaded.");
      $.get(fsPath, function(fsString) {
         console.log(fsPath + " loaded.");

         callback(self.generateProgram(vsString, fsString));
      });
   });
}

Portal.prototype.generateProgram = function(vs, fs) {
   var vertexShader = this.buildShader(this.gl.VERTEX_SHADER, vs);
   var fragmentShader = this.buildShader(this.gl.FRAGMENT_SHADER, fs);

   var shaderProgram = this.gl.createProgram();
   this.gl.attachShader(shaderProgram, vertexShader);
   this.gl.attachShader(shaderProgram, fragmentShader);
   this.gl.linkProgram(shaderProgram);

   if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
      console.log("Could not initialize shaders");

   return shaderProgram;
}

Portal.prototype.buildShader = function(shaderType, script) {
   if (!shaderType)
      return null;

   var shader = this.gl.createShader(shaderType);
   this.gl.shaderSource(shader, script);
   this.gl.compileShader(shader);

   if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
       console.log(this.gl.getShaderInfoLog(shader));
       return null;
   }

   return shader;
}

Portal.prototype.setupHandles = function(program) {
   program.aVertexPosition = this.gl.getAttribLocation(program, "aVertexPosition");
   this.gl.enableVertexAttribArray(program.aVertexPosition);

   program.aVertexNormal = this.gl.getAttribLocation(program, "aVertexNormal");
   this.gl.enableVertexAttribArray(program.aVertexNormal);

   program.aFlags = this.gl.getUniformLocation(program, "uFlags");
   program.uModelMatrix = this.gl.getUniformLocation(program, "uModelMatrix");
   program.uViewMatrix = this.gl.getUniformLocation(program, "uViewMatrix");
   program.uProjectionMatrix = this.gl.getUniformLocation(program, "uProjectionMatrix");
}



// // Super-class
// var Shader = function(gl) {
//    this.gl = gl;
//    this.program = null;
//    this.vsPath = "shaders/normal.vert.glsl";
//    this.fsPath = "shaders/normal.frag.glsl";
//    this.attributes = [100];
//    this.uniforms = [100];

//    // Specify all the handles
//    this.attributes.push("aVertexPosition");
//    this.attributes.push("aVertexNormal");
//    this.uniforms.push("uFlags");
//    this.uniforms.push("uModelMatrix");
//    this.uniforms.push("uViewMatrix");
//    this.uniforms.push("uProjectionMatrix");
// }

// Shader.prototype.load = function() {
//    var self = this;

//    $.get(self.vsPath, function(vsString) {
//       console.log(self.vsPath + " loaded.");
//       $.get(self.fsPath, function(fsString) {
//          console.log(self.fsPath + " loaded.");

//          self.program = self.generateProgram(vsString, fsString);
//          self.setupHandles();
//       });
//    });
// }

// Shader.prototype.generateProgram = function(vs, fs) {
//    var vertexShader = this.buildShader(this.gl, this.gl.VERTEX_SHADER, vs);
//    var fragmentShader = this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, fs);

//    var shaderProgram = this.gl.createProgram();
//    this.gl.attachShader(shaderProgram, vertexShader);
//    this.gl.attachShader(shaderProgram, fragmentShader);
//    this.gl.linkProgram(shaderProgram);

//    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
//       alert("Could not initialize shaders");

//    return shaderProgram;
// }

// Shader.prototype.setupHandles = function(program) {
//    for (var i = 0; i < this.attributes.length; i++) {
//       program[this.attributes[i]] = this.gl.getAttribLocation(program, this.attributes[i]);
//       gl.enableVertexAttribArray(program[this.attributes[i]]);
//    }
//    for (var i = 0; i < this.uniforms.length; i++)
//       program[this.uniforms[i]] = this.gl.getUniformLocation(program, this.uniforms[i]);
// }

// Shader.prototype.sendDataByHandle = function(data, handle) {

// }

