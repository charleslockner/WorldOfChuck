/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initShaders = function() {
   var self = this;

   this.shaders = {
      "forward" :  { program : null,
                     handles : null },
      "geometry" : { program : null,
                     handles : null },
      "lighting" : { program : null,
                     handles : null,
                     vbo : null }
   }

   this.createShaderProgram("shaders/forward.vert.glsl", "shaders/forward.frag.glsl", function(program) {
      self.shaders.forward.handles = self.setupForwardHandles(program);
      self.shaders.forward.program = program;
   });

   this.createShaderProgram("shaders/geometry.vert.glsl", "shaders/geometry.frag.glsl", function(program) {
      self.shaders.geometry.handles = self.setupGeometryHandles(program);
      self.shaders.geometry.program = program;
   });

   this.createShaderProgram("shaders/lighting.vert.glsl", "shaders/lighting.frag.glsl", function(program) {
      self.shaders.lighting.handles = self.setupLightingHandles(program);
      self.shaders.lighting.program = program;

      var verts = [
         1,  1,
        -1,  1,
        -1, -1,
         1,  1,
        -1, -1,
         1, -1,
      ];

      self.shaders.lighting.vbo = self.gl.createBuffer();
      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, self.shaders.lighting.vbo);
      self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(verts), self.gl.STATIC_DRAW);
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

Portal.prototype.setupForwardHandles = function(program) {
   var handles = {
      uModelMatrix : this.gl.getUniformLocation(program, "uModelMatrix"),
      uViewMatrix : this.gl.getUniformLocation(program, "uViewMatrix"),
      uProjectionMatrix : this.gl.getUniformLocation(program, "uProjectionMatrix"),
      uCameraPosition : this.gl.getUniformLocation(program, "uCameraPosition"),
      uLights : this.gl.getUniformLocation(program, "uLights"),
      uNumLights : this.gl.getUniformLocation(program, "uNumLights"),

      aVertexPosition : this.gl.getAttribLocation(program, "aVertexPosition"),
      aVertexNormal : this.gl.getAttribLocation(program, "aVertexNormal"),
      aTextureCoord : this.gl.getAttribLocation(program, "aTextureCoord")
   }

   this.gl.enableVertexAttribArray(handles.aVertexPosition);
   this.gl.enableVertexAttribArray(handles.aVertexNormal);
   this.gl.enableVertexAttribArray(handles.aTextureCoord);

   return handles;
}

Portal.prototype.setupGeometryHandles = function(program) {
   var handles = {
      uModelMatrix : this.gl.getUniformLocation(program, "uModelMatrix"),
      uViewMatrix : this.gl.getUniformLocation(program, "uViewMatrix"),
      uProjectionMatrix : this.gl.getUniformLocation(program, "uProjectionMatrix"),
      // uCameraPosition : this.gl.getUniformLocation(program, "uCameraPosition"),
      // uLights : this.gl.getUniformLocation(program, "uLights"),
      // uNumLights : this.gl.getUniformLocation(program, "uNumLights"),

      aVertexPosition : this.gl.getAttribLocation(program, "aVertexPosition"),
      aVertexNormal : this.gl.getAttribLocation(program, "aVertexNormal"),
      aTextureCoord : this.gl.getAttribLocation(program, "aTextureCoord")
   }

   this.gl.enableVertexAttribArray(handles.aVertexPosition);
   this.gl.enableVertexAttribArray(handles.aVertexNormal);
   this.gl.enableVertexAttribArray(handles.aTextureCoord);

   return handles;
}

Portal.prototype.setupLightingHandles = function(program) {
   var handles = {
      aVertexPosition : this.gl.getAttribLocation(program, "aVertexPosition")
   }

   this.gl.enableVertexAttribArray(handles.aVertexPosition);

   return handles;
}
