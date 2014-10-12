var vs = "attribute vec3 aVertexPosition;\n" +
         "uniform mat4 uMVMatrix;\n" +
         "uniform mat4 uPMatrix;\n" +
         "\n" +
         "void main(void) {\n" +
         "   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
         "}\n";

var fs = "precision mediump float;\n" +
			"varying vec4 vColor;"
         "void main(void) {\n" +
         "   gl_FragColor = vColor;\n" +
         "}";


var shaderProgram;
function initShaders(gl) {
   var fragmentShader = buildShader(gl, gl.FRAGMENT_SHADER, fs);
   var vertexShader = buildShader(gl, gl.VERTEX_SHADER, vs);

   shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
      alert("Could not initialise shaders");

   gl.useProgram(shaderProgram);

   shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
   gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

   shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
   shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function buildShader(gl, shaderType, script) {
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