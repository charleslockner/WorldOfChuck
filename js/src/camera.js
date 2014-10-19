/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


Portal.prototype.initCamera = function() {
   this.camera = {
      position : vec3.fromValues(0, 0, 0),
      direction : vec3.fromValues(0, 0, -1),
      up : vec3.fromValues(0, 1, 0),
      pitch : 0.0,
      yaw : -PI / 2, // start facing down the -Z axis
      camSpeed : 10,
      PITCH_LIMIT : 1.484 // 85 degrees
   }
}

Portal.prototype.updateCamera = function(elapsed) {
   this.moveCamera(elapsed);
   this.aimCamera();
}

Portal.prototype.moveCamera = function(elapsed) {
   if (this.controls.leftPressed)
      this.moveLeft(elapsed);
   if (this.controls.rightPressed)
      this.moveRight(elapsed);
   if (this.controls.forwardPressed)
      this.moveForward(elapsed);
   if (this.controls.backwardPressed)
      this.moveBackward(elapsed);
}

Portal.prototype.moveLeft = function(elapsed) {
   var trans = {};
   vec3.cross(trans, this.camera.direction, this.camera.up);
   vec3.normalize(trans, trans);
   vec3.scale(trans, trans, 0.001 * this.camera.camSpeed * elapsed);
   vec3.sub(this.camera.position, this.camera.position, trans);
}

Portal.prototype.moveRight = function(elapsed) {
   var trans = {};
   vec3.cross(trans, this.camera.direction, this.camera.up);
   vec3.normalize(trans, trans);
   vec3.scale(trans, trans, 0.001 * this.camera.camSpeed * elapsed);
   vec3.add(this.camera.position, this.camera.position, trans);
}

Portal.prototype.moveForward = function(elapsed) {
   var trans = {};
   vec3.scale(trans, this.camera.direction, 0.001 * this.camera.camSpeed * elapsed);
   vec3.add(this.camera.position, this.camera.position, trans);
}

Portal.prototype.moveBackward = function(elapsed) {
   var trans = {};
   vec3.scale(trans, this.camera.direction, 0.001 * this.camera.camSpeed * elapsed);
   vec3.sub(this.camera.position, this.camera.position, trans);
}

Portal.prototype.aimCamera = function() {
   if (this.controls.cursorXDelta || this.controls.cursorXDelta) {

      this.camera.pitch -= .01 * this.controls.cursorYDelta;
      this.camera.yaw += .01 * this.controls.cursorXDelta;

      if (this.camera.pitch >= this.camera.PITCH_LIMIT)
         this.camera.pitch = this.camera.PITCH_LIMIT;
      if (this.camera.pitch <= -this.camera.PITCH_LIMIT)
         this.camera.pitch = -this.camera.PITCH_LIMIT;
      if (this.camera.yaw >= 2.0 * PI)
         this.camera.yaw -= 2.0 * PI;
      if (this.camera.yaw < 0)
         this.camera.yaw += 2.0 * PI;

      var tx = Math.cos(this.camera.pitch) * Math.cos(this.camera.yaw);
      var ty = Math.sin(this.camera.pitch);
      var tz = Math.cos(this.camera.pitch) * Math.cos(PI/2 - this.camera.yaw);
      this.camera.direction = vec3.fromValues(tx, ty, tz);

      this.controls.cursorXDelta = 0;
      this.controls.cursorYDelta = 0;
   }
}
