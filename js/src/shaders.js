
var normalShaderPair = {
	vs :  "attribute vec3 aVertexPosition;\n" +
			"attribute vec3 aVertexNormal;\n" +
         "uniform int uFlags;\n" +
         "uniform mat4 uModelMatrix;\n" +
         "uniform mat4 uViewMatrix;\n" +
         "uniform mat4 uProjectionMatrix;\n" +
         "varying vec3 vWorldNormal;\n" +
         "\n" +
         "void main(void) {\n" +
         "   vec4 normal;\n" +
         "   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n" +
         "      normal = vec4(aVertexNormal, 0.0);\n" +
         "   vWorldNormal = vec3(uModelMatrix * normalize(normal));\n" +
         "}",

	fs :  "precision mediump float;\n" +
			"varying vec3 vWorldNormal;\n" +
         "\n" +
         "void main(void) {\n" +
         "   gl_FragColor = vec4(vWorldNormal, 1.0);\n" +
         "}"
}

var ShaderProgram = function(gl, shaderPair) {
	var program = this.generateProgram(gl, shaderPair);
   
   gl.useProgram(program);
   this.setupHandles(gl, program);

   return program;
}

ShaderProgram.prototype.generateProgram = function(gl, shaderPair) {
   var vertexShader = this.buildShader(gl, gl.VERTEX_SHADER, shaderPair.vs);
   var fragmentShader = this.buildShader(gl, gl.FRAGMENT_SHADER, shaderPair.fs);

   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      alert("Could not initialise shaders");

   return shaderProgram;
}

ShaderProgram.prototype.buildShader = function(gl, shaderType, script) {
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

ShaderProgram.prototype.setupHandles = function(gl, program) {
   program.aFlags = gl.getUniformLocation(program, "uFlags")

   program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
   gl.enableVertexAttribArray(program.aVertexPosition);

   program.aVertexNormal = gl.getAttribLocation(program, "aVertexNormal");
   gl.enableVertexAttribArray(program.aVertexNormal);

   program.uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");
   program.uViewMatrix = gl.getUniformLocation(program, "uViewMatrix");
   program.uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
}
