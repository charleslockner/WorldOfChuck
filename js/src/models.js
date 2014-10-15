var ModelLibrary = function(gl) {
	var models = {
		cube : null
	};

	models.cube = this.initCube(gl);


	// $.getJSON("assets/cube.json", function(json) {
	//     console.log(json);
	// });


	return models;
}

ModelLibrary.prototype.cubeModel = {
	vertices : [
		// Front face
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		1.0,  1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0,  1.0,  1.0,
		1.0, -1.0,  1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0 ],
	
	normals : [
		// Front face
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		// Back face
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		// Top face
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		// Bottom face
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		// Right face
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		// Left face
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0 ],

	indices : [
		0, 1, 2,      0, 2, 3,      // Front face
		4, 5, 6,      4, 6, 7,      // Back face
		8, 9, 10,     8, 10, 11,    // Top face
		12, 13, 14,   12, 14, 15,   // Bottom face
		16, 17, 18,   16, 18, 19,   // Right face
		20, 21, 22,   20, 22, 23 ], // Left face
}

ModelLibrary.prototype.initCube = function(gl) {
   // vertex positions
   var cube = {
   	  metadata : { faces : 12 },
   	  vbo : null,
   	  nbo : null,
   	  ibo : null
   };

   // vertex positions
   cube.vbo = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cube.vbo);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeModel.vertices), gl.STATIC_DRAW);

   // vertex normals
   cube.nbo = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cube.nbo);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeModel.normals), gl.STATIC_DRAW);

   // indices to vertices
   cube.ibo = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.ibo);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.cubeModel.indices), gl.STATIC_DRAW);

   return cube;
}
