
var PI = 3.14159;
var PITCH_LIMIT = 1.484; // 85 degrees

/*********************************** PUBLIC ***********************************/
var Portal = function(canvas) {
   this.canvas = canvas;
   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
   this.shaderProgram = null;
   this.models = null;
   this.system = null;

   this.gl ? this.setup() : alert("Unable to initialize WebGL. Your browser may not support it.");
}
/******************************************************************************/


Portal.prototype.setup = function() {
   this.initGLProperties();
   this.initShaders();
   this.initModels();
   this.initSystem();
   this.initControls();

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

Portal.prototype.initShaders = function() {
   this.shaderProgram = new ShaderProgram(this.gl, normalShaderPair);
}

Portal.prototype.initModels = function() {
   this.models = new ModelLibrary(this.gl);
}

Portal.prototype.initSystem = function() {
//    this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
//                             this.canvas.mozRequestPointerLock ||
//                             this.canvas.webkitRequestPointerLock;

//    this.canvas.requestPointerLock();

//    if(document.pointerLockElement === this.canvas ||
//   document.mozPointerLockElement === this.canvas ||
//   document.webkitPointerLockElement === this.canvas) {
//     console.log('The pointer lock status is now locked');
// } else {
//     console.log('The pointer lock status is now unlocked');  
// }


   this.system = {
      rCube : 0.0,
      camera : {
         position : vec3.fromValues(0.0, 1.0, 10.0),
         direction : vec3.fromValues(0.0, 0.0, -1.0),
         up : vec3.fromValues(0.0, 1.0, 0.0),
         pitch : 0.0,
         yaw : -PI / 2
      },
      controls : {
         forwardPressed : false,
         backwardPressed : false,
         leftPressed : false,
         rightPressed : false,

         lastX : null,
         lastY : null,
         cursorXDelta : 0,
         cursorYDelta : 0
      }
   }
}

Portal.prototype.initControls = function() {
   this.attachControls();
}

