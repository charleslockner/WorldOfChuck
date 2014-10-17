/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


// Super-class
var Shader = function(gl) {
   this.gl = gl;
   this.program = null;
   this.vsPath = "shaders/normal.vert.glsl";
   this.fsPath = "shaders/normal.frag.glsl";
   this.attributes = [100];
   this.uniforms = [100];

   // Specify all the handles
   this.attributes.push("aVertexPosition");
   this.attributes.push("aVertexNormal");
   this.uniforms.push("uFlags");
   this.uniforms.push("uModelMatrix");
   this.uniforms.push("uViewMatrix");
   this.uniforms.push("uProjectionMatrix");
}

Shader.prototype.load = function() {
   var self = this;

   $.get(self.vsPath, function(vsString) {
      console.log(self.vsPath + " loaded.");
      $.get(self.fsPath, function(fsString) {
         console.log(self.fsPath + " loaded.");

         self.program = self.generateProgram(vsString, fsString);
         self.setupHandles();
      });
   });
}

Shader.prototype.generateProgram = function(vs, fs) {
   var vertexShader = this.buildShader(this.gl, this.gl.VERTEX_SHADER, vs);
   var fragmentShader = this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, fs);

   var shaderProgram = this.gl.createProgram();
   this.gl.attachShader(shaderProgram, vertexShader);
   this.gl.attachShader(shaderProgram, fragmentShader);
   this.gl.linkProgram(shaderProgram);

   if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
      alert("Could not initialize shaders");

   return shaderProgram;
}

Shader.prototype.setupHandles = function(program) {
   for (var i = 0; i < this.attributes.length; i++) {
      program[this.attributes[i]] = this.gl.getAttribLocation(program, this.attributes[i]);
      gl.enableVertexAttribArray(program[this.attributes[i]]);
   }
   for (var i = 0; i < this.uniforms.length; i++)
      program[this.uniforms[i]] = this.gl.getUniformLocation(program, this.uniforms[i]);
}





Portal.prototype.initShaders = function() {
   var self = this;

   // var shader = new Shader();
   // shader.load();

   this.createShaderProgram("shaders/phong.vert.glsl", "shaders/phong.frag.glsl", function(program) {
      self.shaderProgram = program;
      self.gl.useProgram(self.shaderProgram);
   });
}

Portal.prototype.createShaderProgram = function(vsPath, fsPath, callback) {
   var self = this;

   $.get(vsPath, function(vsString) {
      console.log(vsPath + " loaded.");
      $.get(fsPath, function(fsString) {
         console.log(fsPath + " loaded.");

         var program = self.generateProgram(self.gl, vsString, fsString);
         self.setupHandles(program);

         callback(program);
      });
   });
}

Portal.prototype.generateProgram = function(gl, vs, fs) {
   var vertexShader = this.buildShader(gl, gl.VERTEX_SHADER, vs);
   var fragmentShader = this.buildShader(gl, gl.FRAGMENT_SHADER, fs);

   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      alert("Could not initialize shaders");

   return shaderProgram;
}

Portal.prototype.buildShader = function(gl, shaderType, script) {
   if (!shaderType)
      return null;

   var shader = gl.createShader(shaderType);
   gl.shaderSource(shader, script);
   gl.compileShader(shader);

   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
       alert(gl.getShaderInfoLog(shader));
       return null;
   }

   return shader;
}

Portal.prototype.setupHandles = function(program) {
   program.aFlags = this.gl.getUniformLocation(program, "uFlags");

   program.aVertexPosition = this.gl.getAttribLocation(program, "aVertexPosition");
   this.gl.enableVertexAttribArray(program.aVertexPosition);

   program.aVertexNormal = this.gl.getAttribLocation(program, "aVertexNormal");
   this.gl.enableVertexAttribArray(program.aVertexNormal);

   program.uModelMatrix = this.gl.getUniformLocation(program, "uModelMatrix");
   program.uViewMatrix = this.gl.getUniformLocation(program, "uViewMatrix");
   program.uProjectionMatrix = this.gl.getUniformLocation(program, "uProjectionMatrix");
}
