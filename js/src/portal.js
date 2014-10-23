/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var Portal = function(canvas) {
   this.canvas = canvas;
   this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

   if (!this.gl) {
      alert("Please use Chrome, if not that, then Firefox.");
      return null;
   }

   // Listing here all the instance variables that belong to Portal
   this.models = null;
   this.entities = null;
   this.controls = null;
   this.camera = null;
   this.shaderProgram = null;
   this.lastUpdateTime = 0;
   this.NEAR_DISTANCE = 0.1;
   this.FAR_DISTANCE = 2000;

   // Rev-up this icicle clam!!
   this.setup()
}

Portal.prototype.setup = function() {

   // window.setInterval(function() {
   //    $.ajax({
   //       type: 'POST',
   //       url: '/server.js',
   //       data: "hi",
   //       // dataType: dataType,
   //       async: true,
   //       success: function(result) {
   //                    if(result.isOk == false)
   //                        console.log(result.message);
   //          }
   //    }); 
   // }, 1000);

   this.initGLProperties();
   this.initModels();   // models.js
   this.initWorld();    // system.js (initializes the camera and the entities)
   this.initControls(); // controls.js
   this.initCamera();
   this.initShaders();  // shaders.js

   this.loop();         // loop.js (Begin main loop)
}

Portal.prototype.initGLProperties = function() {
   this.gl.clearColor(0.05, 0.05, 0.2, 1.0);
   this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
   this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
   this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
   // this.gl.PolygonMode( this.GL_FRONT_AND_BACK, GL_LINE );
}
