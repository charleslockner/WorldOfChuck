/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initShaders = function() {
   var self = this;

   this.initDeferredFramebuffer();

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


Portal.prototype.initDeferredFramebuffer = function() {
   // create frame buffer
   this.deferredFB = this.gl.createFramebuffer();
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.deferredFB); // the next draw calls will operate on this framebuffer

   // create textures to store the render buffers
   this.renderTextures = [
      this.createEmptyTexture(),
      this.createEmptyTexture(),
      this.createEmptyTexture(),
      this.createEmptyTexture()
   ]; 

   // attaching the color storage
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT0_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[0], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT1_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[1], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT2_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[2], 0);
   this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT3_WEBGL, this.gl.TEXTURE_2D, this.renderTextures[3], 0);

   // create and attach storage for depth information
   var renderbuffer = this.createRenderbuffer();
   this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);

   // set everything back to defaults
   this.gl.bindTexture(this.gl.TEXTURE_2D, null);
   this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
}

Portal.prototype.createEmptyTexture = function() {
   var tex = this.gl.createTexture();
   this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
   this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
   
   // allocate space to draw texture to
   this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight,
                      0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

   return tex;
}

Portal.prototype.createRenderbuffer = function() {
   var renderbuffer = this.gl.createRenderbuffer();
   this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
   this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
   return renderbuffer;
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
