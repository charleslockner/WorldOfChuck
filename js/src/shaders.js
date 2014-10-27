/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initShaders = function() {
   var self = this;

   this.createShaderProgram("shaders/forward.vert.glsl", "shaders/forward.frag.glsl", function(program) {
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
   // uniforms
   program.uModelMatrix = this.gl.getUniformLocation(program, "uModelMatrix");
   program.uViewMatrix = this.gl.getUniformLocation(program, "uViewMatrix");
   program.uProjectionMatrix = this.gl.getUniformLocation(program, "uProjectionMatrix");
   program.uCameraPosition = this.gl.getUniformLocation(program, "uCameraPosition");
   program.uLights = this.gl.getUniformLocation(program, "uLights");
   program.uNumLights = this.gl.getUniformLocation(program, "uNumLights");

   // attributes
   program.aVertexPosition = this.gl.getAttribLocation(program, "aVertexPosition");
   this.gl.enableVertexAttribArray(program.aVertexPosition);

   program.aVertexNormal = this.gl.getAttribLocation(program, "aVertexNormal");
   this.gl.enableVertexAttribArray(program.aVertexNormal);

   program.aTextureCoord = this.gl.getAttribLocation(program, "aTextureCoord");
   this.gl.enableVertexAttribArray(program.aTextureCoord);
}
