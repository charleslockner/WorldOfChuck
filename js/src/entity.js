/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

// Super-class
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
   var flags = 1; // flat shade the object
   gl.uniform1i(shaderProgram.uFlags, flags);

   var modelM = this.makeModelMatrix();
   gl.uniformMatrix4fv(shaderProgram.uModelMatrix, false, modelM);

   gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
   gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
   gl.bindBuffer(gl.ARRAY_BUFFER, model.nbo);
   gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.ibo);

   gl.drawElements(gl.TRIANGLES, 3 * model.faces, gl.UNSIGNED_SHORT, 0);
}

Entity.prototype.makeModelMatrix = function() {
   var modelM = mat4.create();
   // mat4.identity(modelM); // Set to identity
   mat4.translate(modelM, modelM, vec3.fromValues(this.position[0], this.position[1], this.position[2]));
   mat4.rotate(modelM, modelM, this.rotation, vec3.fromValues(0.0, 1.0, 0.0));
   // mat4.scale(modelM, modelM, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));

   return modelM;
}





var WorldOfChuck = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "worldofchuck";
};

// Make WorldOfChuck a subclass of Entity
WorldOfChuck.prototype = new Entity();
WorldOfChuck.prototype.constructor = WorldOfChuck;

var Cube = function(pos, rot) {
   Entity.call(this, pos, rot);
   this.modelName = "cube";
};

// Make Cube a subclass of Entity
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

var GroundTile = function(xNdx, yNdx) {
   this.xNdx = xNdx;
   this.yNdx = yNdx;
   this.rotation = 0;
   this.mapName = "ground";
};

// Make GroundModel a subclass of Entity
GroundTile.prototype = new Entity();
GroundTile.prototype.constructor = GroundTile;

GroundTile.prototype.draw = function(gl, shaderProgram, models) {
   var tileMap = models[this.mapName];
   var model = tileMap.get(this.xNdx, this.yNdx);
   this.position = [tileMap.tileWidth * this.xNdx, tileMap.tileHeight, tileMap.tileWidth * this.yNdx];
   this.drawModel(gl, shaderProgram, model);
}


