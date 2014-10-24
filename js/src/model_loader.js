/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var ModelLoader = {
   load : function(gl, path, callback) {
      $.getJSON(path, function(json) {
         console.log(path + " loaded.");
         var model = ModelLoader.createFromJSON(gl, json);
         callback(model);
      });
   },

   createFromJSON : function(gl, json) {
      var model = {
         faces : json.faces.length/3,
         vbo : gl.createBuffer(),
         nbo : gl.createBuffer(),
         ibo : gl.createBuffer(),
         xWidth : json.xWidth || null,
         zWidth : json.zWidth || null,
         height : json.height || null
      }

      // vertex positions
      gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(json.vertices), gl.STATIC_DRAW);

      // vertex normals
      gl.bindBuffer(gl.ARRAY_BUFFER, model.nbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(json.normals), gl.STATIC_DRAW);

      // indices to vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(json.faces), gl.STATIC_DRAW);

      return model;
   }
}
