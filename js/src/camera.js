Portal.prototype.updateCamera = function(elapsed) {
   var camSpeed = 10;
   if (this.system.controls.leftPressed) {
      var trans = {};
      vec3.normalize(trans, this.system.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.system.camera.up);
      vec3.sub(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.rightPressed) {
      var trans = {};
      vec3.normalize(trans, this.system.camera.direction);
      vec3.scale(trans, trans, 0.001 * camSpeed * elapsed);
      vec3.cross(trans, trans, this.system.camera.up);
      vec3.add(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.forwardPressed) {
      var trans = {};
      vec3.scale(trans, this.system.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.add(this.system.camera.position, this.system.camera.position, trans);
   }
   if (this.system.controls.backwardPressed) {
      var trans = {};
      vec3.scale(trans, this.system.camera.direction, 0.001 * camSpeed * elapsed);
      vec3.sub(this.system.camera.position, this.system.camera.position, trans);
   }

   this.aimCamera();
}

Portal.prototype.aimCamera = function() {
   var PITCH_LIMIT = 1.484; // 85 degrees

   if (this.system.controls.cursorXDelta || this.system.controls.cursorXDelta) {

      var pitch = this.system.camera.pitch;
      var yaw = this.system.camera.yaw;

      pitch = pitch - this.system.controls.cursorYDelta * .01;
      yaw = yaw + this.system.controls.cursorXDelta * .01;

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
      this.system.camera.direction = vec3.fromValues(tx, ty, tz);

      this.system.camera.pitch = pitch;
      this.system.camera.yaw = yaw;
      this.system.controls.cursorXDelta = 0;
      this.system.controls.cursorYDelta = 0;
   }
}
