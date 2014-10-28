/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

// ================== Super-class Entity ===================
var Entity = function(pos, rot) {
   this.position = pos;
   this.rotation = rot;
   this.modelName = "unknown";
}

Entity.prototype.draw = function(gl, shaderProgram, models) {
   var model = models[this.modelName] || models.unknown;

   this.drawModel(gl, shaderProgram, model);
}

Entity.prototype.drawModel = function(gl, shaderProgram, model) {
   var modelM = this.makeModelMatrix();
   gl.uniformMatrix4fv(shaderProgram.uModelMatrix, false, modelM);

   gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
   gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ARRAY_BUFFER, model.nbo);
   gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

   gl.bindBuffer(gl.ARRAY_BUFFER, model.tbo);
   gl.vertexAttribPointer(shaderProgram.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, model.texture);
   gl.uniform1i(shaderProgram.samplerUniform, 0);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.ibo);
   gl.drawElements(gl.TRIANGLES, 3 * model.faces, gl.UNSIGNED_SHORT, 0);




   // var depthTextureExtension = gl.getExtension("WEBGL_depth_texture");
   // if (!depthTextureExtension) {
   //     alert("depth textures not supported");
   // }

   // // create a depth texture.
   // var depthTex = gl.createTexture();
   // gl.bindTexture(gl.TEXTURE_2D, depthTex);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 16, 16, 0,
   //               gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

   // // Create a framebuffer and attach the textures.
   // var fb = gl.createFramebuffer();
   // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
   //                         gl.TEXTURE_2D, depthTex, 0);
   // gl.bindTexture(gl.TEXTURE_2D, null);
   // console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

   // // use the default texture to render with while we render to the depth texture.
   // gl.bindTexture(gl.TEXTURE_2D, null);

   // // Render to the depth texture
   // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
   // gl.clear(gl.DEPTH_BUFFER_BIT);
   // gl.drawArrays(gl.TRIANGLES, 0, 6);

   // // Now draw with the texture to the canvas
   // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   // gl.bindTexture(gl.TEXTURE_2D, depthTex);
   // gl.drawArrays(gl.TRIANGLES, 0, 6);
}

Entity.prototype.makeModelMatrix = function() {
   var modelM = mat4.create();
   // mat4.identity(modelM); // Set to identity
   mat4.translate(modelM, modelM, vec3.fromValues(this.position[0], this.position[1], this.position[2]));
   mat4.rotate(modelM, modelM, this.rotation, vec3.fromValues(0.0, 1.0, 0.0));
   // mat4.scale(modelM, modelM, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));

   return modelM;
}

Entity.prototype.update = function(elapsed) {
   this.rotation += 0.3 * elapsed / 1000.0;
}

// ============================ Subclasses =================================

var WorldOfChuck = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "worldofchuck";
};

WorldOfChuck.prototype = new Entity();
WorldOfChuck.prototype.constructor = WorldOfChuck;

WorldOfChuck.prototype.update = function(elapsed) {
   this.rotation += 1 * elapsed / 1000.0;
}


var Monkey = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "monkey";
};

Monkey.prototype = new Entity();
Monkey.prototype.constructor = Monkey;


var Cube = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "cube";
};

Cube.prototype = new Entity();
Cube.prototype.constructor = Cube;

var Sphere = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "sphere";
};

// Make Sphere a subclass of Entity
Sphere.prototype = new Entity();
Sphere.prototype.constructor = Sphere;

var Pillar = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "pillar";
};

// Make Pillar a subclass of Entity
Pillar.prototype = new Entity();
Pillar.prototype.constructor = Pillar;

var Character = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "character";
};

// Make Pillar a subclass of Entity
Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function(elapsed) {
   // this.rotation += 1 * elapsed / 1000.0;
}



// ========================================== TERRAIN ========================================== //

var Terrain = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.tileOffset = [0,0,0];
};

Terrain.prototype = new Entity();
Terrain.prototype.constructor = Terrain;

Terrain.prototype.draw = function(gl, shaderProgram, models) {
   var xF = models.terrainHandler.getXFirstNdx();
   var xL = models.terrainHandler.getXLastNdx();
   var zF = models.terrainHandler.getYFirstNdx();
   var zL = models.terrainHandler.getYLastNdx();
   var tileWidth = models.terrainHandler.getTileWidth();

   for (var x = xF; x <= xL; x++)
      for (var z = zF; z <= zL; z++) {
         var isVisible = models.terrainHandler.isVisible(x, z);
         
         if (isVisible) {
            var model = models.terrainHandler.getTile(x, z) || models.unknown;

            this.tileOffset = [model.xWidth * x, 0, model.zWidth * z]; 
            this.drawModel(gl, shaderProgram, model);
         }
      }
}

Terrain.prototype.makeModelMatrix = function() {
   var modelM = mat4.create();
   var actualPos = [this.position[0] + this.tileOffset[0], 
                    this.position[1] + this.tileOffset[1], 
                    this.position[2] + this.tileOffset[2]];
   // mat4.identity(modelM); // Set to identity
   mat4.translate(modelM, modelM, vec3.fromValues(actualPos[0], actualPos[1], actualPos[2]));
   mat4.rotate(modelM, modelM, this.rotation, vec3.fromValues(0.0, 1.0, 0.0));
   // mat4.scale(modelM, modelM, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));
   return modelM;
}

// Terrain.prototype.update = function(elapsed) {
//    var curX = Math.floor(this.camera.position[0] / this.models.terrainHandler.tileWidth + 0.5);
//    var curZ = Math.floor(this.camera.position[2] / this.models.terrainHandler.tileWidth + 0.5);

//    var xKeepF = curX - 2;
//    var xKeepL = curX + 2;
//    var zKeepF = curZ - 2;
//    var zKeepL = curZ + 2;

//    var xF = this.models.terrainHandler.tileMap.xFirstNdx;
//    var xL = this.models.terrainHandler.tileMap.xLastNdx;
//    var zF = this.models.terrainHandler.tileMap.yFirstNdx;
//    var zL = this.models.terrainHandler.tileMap.yLastNdx;

//    // create tiles
//    for (var x = xKeepF; x <= xKeepL; x++)
//       for (var z = zKeepF; z <= zKeepL; z++)
//          this.models.terrainHandler.placeTile(x, z, true);

//    // remove WEST tiles
//    for (var x = xF; x < xKeepF; x++)
//       for (var z = zF; z <= zL; z++)
//          this.models.terrainHandler.setVisible(x, z, false);

//    // remove EAST tiles
//    for (var x = xKeepL+1; x <= xL; x++)
//       for (var z = zF; z <= zL; z++)
//             this.models.terrainHandler.setVisible(x, z, false);

//    // remove NORTH tiles
//    for (var x = xKeepF; x <= xKeepL; x++)
//       for (var z = zF; z < zKeepF; z++)
//          this.models.terrainHandler.setVisible(x, z, false);

//    // remove SOUTH tiles
//    for (var x = xKeepF; x <= xKeepL; x++)
//       for (var z = zKeepL+1; z <= zL; z++)
//          this.models.terrainHandler.setVisible(x, z, false);

// }

