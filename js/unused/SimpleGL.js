
function SimpleGL(canvas) {
   var self = this;
   var canvas = canvas;

   self.gl = null;

   initCanvas();

   function initCanvas() {
      self.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!self.gl)
         alert("Unable to initialize WebGL. Your browser may not support it.");
      else {
         initWebGL();
      }

      addEventListeners();
   }

   function initWebGL() {
      self.gl.clearColor(0.5, 0.0, 0.0, 1.0);                              // Set clear color to black, fully opaque
      self.gl.enable(self.gl.DEPTH_TEST);                                  // Enable depth testing
      self.gl.depthFunc(self.gl.LEQUAL);                                   // Near things obscure far things
      self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.
   }

   function addEventListeners() {
      window.addEventListener('resize', onWindowResize);
   }

   function onWindowResize() {
      self.fitCanvasToWindow();
   }

   this.fitCanvasToWindow = function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
   };

   this.startAnimationLoop = function() {
      desiredFPS = FPS;
      setInterval(animLoop, 1000 / desiredFPS);
   }

   var time;
   function draw(val) {
      requestAnimationFrame(draw);
      var now = new Date().getTime(),
          dt = now - (time || now);

      time = now;

      // Drawing code goes here... for example updating an 'x' position:
      this.x += 10 * dt; // Increase 'x' by 10 units per millisecond
   }
}
