/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

Portal.prototype.initControls = function() {
   this.controls = {
      forwardPressed : false,
      backwardPressed : false,
      leftPressed : false,
      rightPressed : false,

      cursorXDelta : 0,
      cursorYDelta : 0
   };

    this.bindEvents();
}

Portal.prototype.bindEvents = function() {
   var self = this;

   $(window).bind('keydown', function(e) {
      var code = e.keyCode || e.which;
      
      switch (code) {
         case 65: // A
            self.controls.leftPressed = true;
            break; 
         case 68: // D
            self.controls.rightPressed = true;
            break;
         case 87: // W
            self.controls.forwardPressed = true;
            break;
         case 83: // S
            self.controls.backwardPressed = true;
            break;
      }
   });

   $(window).bind('keyup', function(e) {
      var code = e.keyCode || e.which;
      
      switch (code) {
         case 65: // A
            self.controls.leftPressed = false;
            break; 
         case 68: // D
            self.controls.rightPressed = false;
            break;
         case 87: // W
            self.controls.forwardPressed = false;
            break;
         case 83: // S
            self.controls.backwardPressed = false;
            break;
      }
   });

   $(window).click(function () {
      var canvas = self.canvas;
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();

      launchIntoFullscreen(canvas);
   });

   document.addEventListener(POINTER_LOCK_CHANGE, this.lockChangeAlert.bind(this), false);
}

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

Portal.prototype.lockChangeAlert = function() {
   var self = this;

   var moveCallback = function(e) {
      self.controls.cursorXDelta = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      self.controls.cursorYDelta = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
   }

   if (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement)
      document.addEventListener("mousemove", this.moveCallback.bind(this), false);
   else
      document.removeEventListener("mousemove", this.moveCallback.bind(this), false); // not working
}

Portal.prototype.moveCallback = function(e) {
   this.controls.cursorXDelta = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
   this.controls.cursorYDelta = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
}
