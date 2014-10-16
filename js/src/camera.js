
Portal.prototype.initCamera = function() {
   this.camera = {
      position : vec3.fromValues(0, 0, 0),
      direction : vec3.fromValues(0, 0, -1),
      up : vec3.fromValues(0, 1, 0),
      pitch : 0.0,
      yaw : -PI / 2
   }
}

Portal.prototype.updateCamera = function(elapsed) {
   var camSpeed = 10;
   if (this.controls.leftPressed) {
      var trans = {};
      vec3.normalize(trans, this.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.camera.up);
      vec3.sub(this.camera.position, this.camera.position, trans);
   }
   if (this.controls.rightPressed) {
      var trans = {};
      vec3.normalize(trans, this.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.camera.up);
      vec3.add(this.camera.position, this.camera.position, trans);
   }
   if (this.controls.forwardPressed) {
      var trans = {};
      vec3.scale(trans, this.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.add(this.camera.position, this.camera.position, trans);
   }
   if (this.controls.backwardPressed) {
      var trans = {};
      vec3.scale(trans, this.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.sub(this.camera.position, this.camera.position, trans);
   }

   this.aimCamera();
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
