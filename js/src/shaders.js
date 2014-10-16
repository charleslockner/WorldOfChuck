/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initShaders = function() {
   var self = this;

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
         self.setupHandles(self.gl, program);

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

Portal.prototype.setupHandles = function(gl, program) {
   program.aFlags = gl.getUniformLocation(program, "uFlags")

   program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
   gl.enableVertexAttribArray(program.aVertexPosition);

   program.aVertexNormal = gl.getAttribLocation(program, "aVertexNormal");
   gl.enableVertexAttribArray(program.aVertexNormal);

   program.uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");
   program.uViewMatrix = gl.getUniformLocation(program, "uViewMatrix");
   program.uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
}
