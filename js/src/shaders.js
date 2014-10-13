
var normalShaderPair = {
	vs :  "attribute vec3 aVertexPosition;\n" +
			"attribute vec3 aVertexNormal;\n" +
         "uniform mat4 uMVMatrix;\n" +
         "uniform mat4 uPMatrix;\n" +
         "varying vec3 vColor;\n" +
         "\n" +
         "void main(void) {\n" +
         "   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
         "   vColor = aVertexNormal;\n" +
         "}",

	fs :  "precision mediump float;\n" +
			"varying vec3 vColor;\n" +
         "void main(void) {\n" +
         "   gl_FragColor = vec4(vColor, 1.0);\n" +
         "}"
}

function ShaderProgram(gl, shaderPair) {
   var vertexShader = this.buildShader(gl, gl.VERTEX_SHADER, shaderPair.vs);
   var fragmentShader = this.buildShader(gl, gl.FRAGMENT_SHADER, shaderPair.fs);

   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      alert("Could not initialise shaders");

   gl.useProgram(shaderProgram);

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