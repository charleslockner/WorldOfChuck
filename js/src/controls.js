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

    $(window).click(function () {
        var canvas = self.canvas;
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    });

	document.addEventListener(POINTER_LOCK_CHANGE, this.lockChangeAlert.bind(this), false);
}

Portal.prototype.lockChangeAlert = function() {
	var self = this;

	var moveCallback = function(e) {
	    self.system.controls.cursorXDelta = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
	    self.system.controls.cursorYDelta = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    }

	if (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement)
	    document.addEventListener("mousemove", this.moveCallback.bind(this), false);
	else
	  document.removeEventListener("mousemove", this.moveCallback.bind(this), false); // not working
}

Portal.prototype.moveCallback = function(e) {
    this.system.controls.cursorXDelta = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    this.system.controls.cursorYDelta = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
}
