/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var ModelLoader = {
   load : function(gl, jsonPath, imagePath, callback) {
      ModelLoader.loadJSON(gl, jsonPath, function(mesh) {
         ModelLoader.loadImage(gl, imagePath, function(texture) {
            callback(ModelLoader.createFromJSONAndImage(gl, mesh, texture));
         })
      });
   },

   loadJSON : function(gl, path, callback) {
      $.getJSON(path, function(json) {
         console.log(path + " loaded.");
         callback(json);
      });
   },

   loadImage : function(gl, path, callback) {
      var texture = gl.createTexture();
      texture.image = new Image();
      texture.image.src = path;
      texture.image.onload = function () {
         console.log(path + " loaded.");
         gl.bindTexture(gl.TEXTURE_2D, texture);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.bindTexture(gl.TEXTURE_2D, null);
         callback(texture);
      }
   },

   createFromJSON : function(gl, json) {
      return ModelLoader.createFromJSONAndImage(gl, json, null);
   },

   createFromJSONAndImage : function(gl, mesh, texture) {
      var model = {
         faces : mesh.faces.length/3,
         vbo : gl.createBuffer(),
         nbo : gl.createBuffer(),
         tbo : gl.createBuffer(),
         ibo : gl.createBuffer(),
         texture : texture,
         xWidth : mesh.xWidth || null,
         zWidth : mesh.zWidth || null,
         height : mesh.height || null
      }

      // vertex positions
      gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

      // vertex normals
      gl.bindBuffer(gl.ARRAY_BUFFER, model.nbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);

      // vertex texture coordinates
      gl.bindBuffer(gl.ARRAY_BUFFER, model.tbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uvs), gl.STATIC_DRAW);

      // indices to vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces), gl.STATIC_DRAW);

      return model;
   }
}




