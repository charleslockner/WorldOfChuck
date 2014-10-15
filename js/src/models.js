Portal.prototype.loadModels = function() {
	this.models = {
		cube : null
	};

	this.initCube();
}

Portal.prototype.initCube = function() {
	var self = this;

	$.getJSON("assets/pillar.json", function(json) {
      console.log(json);

      var cube = {
	  	   faces : json.metadata.faces,
	   	vbo : self.gl.createBuffer(),
	   	nbo : self.gl.createBuffer(),
	   	ibo : self.gl.createBuffer()
	   }

	   // vertex positions
	   self.gl.bindBuffer(self.gl.ARRAY_BUFFER, cube.vbo);
	   self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(json.vertices), self.gl.STATIC_DRAW);

	   // vertex normals
	   self.gl.bindBuffer(self.gl.ARRAY_BUFFER, cube.nbo);
	   self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(json.normals), self.gl.STATIC_DRAW);

	   // indices to vertices
	   self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, cube.ibo);
	   self.gl.bufferData(self.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(json.faces), self.gl.STATIC_DRAW);

	   self.models.cube = cube;
	});
}
