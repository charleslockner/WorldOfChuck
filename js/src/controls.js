Portal.prototype.attachControls = function() {
	var self = this;

	$(window).bind('keydown', function(e) {
		var code = e.keyCode || e.which;
		
		switch (code) {
			case 65: // A
				self.system.controls.leftPressed = true;
				break; 
			case 68: // D
				self.system.controls.rightPressed = true;
				break;
			case 87: // W
				self.system.controls.forwardPressed = true;
				break;
			case 83: // S
				self.system.controls.backwardPressed = true;
				break;
		}
	});

	$(window).bind('keyup', function(e) {
		var code = e.keyCode || e.which;
		
		switch (code) {
			case 65: // A
				self.system.controls.leftPressed = false;
				break; 
			case 68: // D
				self.system.controls.rightPressed = false;
				break;
			case 87: // W
				self.system.controls.forwardPressed = false;
				break;
			case 83: // S
				self.system.controls.backwardPressed = false;
				break;
		}
	});


	// function changeCallback(e) {
 //        var canvas = $("#pointerLock").get()[0];
 //        if (document.pointerLockElement === canvas ||
 //                document.mozPointerLockElement === canvas ||
 //                document.webkitPointerLockElement === canvas) {
 
 //            // we've got a pointerlock for our element, add a mouselistener
 //            document.addEventListener("mousemove", moveCallback, false);
 //        } else {
 
 //            // pointer lock is no longer active, remove the callback
 //            document.removeEventListener("mousemove", moveCallback, false);
 
 //            // and reset the entry coordinates
 //            entryCoordinates = {x:-1, y:-1};
 //        }
 //    };

 //    function moveCallback(e) {
 //        self.system.controls.cursorXDelta = e.movementX ||
 //                e.mozMovementX ||
 //                e.webkitMovementX ||
 //                0;
 
 //        self.system.controls.cursorYDelta = e.movementY ||
 //                e.mozMovementY ||
 //                e.webkitMovementY ||
 //                0;
 //        console.log(e.movementX);

	// 	self.system.controls.lastX = event.pageX;
	// 	self.system.controls.lastY = event.pageY;
	// }

	// $(window).mousemove(function( e ) {
		// if (!self.system.controls.lastX || !self.system.controls.lastY) {
		// 	self.system.controls.lastX = event.pageX;
		// 	self.system.controls.lastY = event.pageY;
		// }
		// else {
			// self.system.controls.cursorXDelta = event.pageX - self.system.controls.lastX;
			// self.system.controls.cursorYDelta = event.pageY - self.system.controls.lastY;

	  //       self.system.controls.cursorXDelta = e.movementX ||
	  //               e.mozMovementX ||
	  //               e.webkitMovementX ||
	  //               0;
	 
	  //       self.system.controls.cursorYDelta = e.movementY ||
	  //               e.mozMovementY ||
	  //               e.webkitMovementY ||
	  //               0;
	  //       console.log(e.movementX);

			// self.system.controls.lastX = event.pageX;
			// self.system.controls.lastY = event.pageY;
		// }
	// });

	// when element is clicked, we're going to request a
	// pointerlock
    $(window).click(function () {
        var canvas = self.canvas;
        canvas.requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;

        // Ask the browser to lock the pointer)
        canvas.requestPointerLock();
    });
}