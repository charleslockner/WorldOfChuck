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
      yaw : -PI / 2,
      camSpeed : 10
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
   var PITCH_LIMIT = 1.484; // 85 degrees

   if (this.controls.cursorXDelta || this.controls.cursorXDelta) {

      var pitch = this.camera.pitch;
      var yaw = this.camera.yaw;

      pitch = pitch - this.controls.cursorYDelta * .01;
      yaw = yaw + this.controls.cursorXDelta * .01;

      if (pitch >= PITCH_LIMIT)
         pitch = PITCH_LIMIT;
      if (pitch <= -PITCH_LIMIT)
         pitch = -PITCH_LIMIT;
      if (yaw >= 2.0 * PI)
         yaw -= 2.0 * PI;
      if (yaw < 0)
         yaw += 2.0 * PI;

      var tx = Math.cos(pitch) * Math.cos(yaw);
      var ty = Math.sin(pitch);
      var tz = Math.cos(pitch) * Math.cos(PI/2 - yaw);
      this.camera.direction = vec3.fromValues(tx, ty, tz);

      this.camera.pitch = pitch;
      this.camera.yaw = yaw;
      this.controls.cursorXDelta = 0;
      this.controls.cursorYDelta = 0;
   }
}
