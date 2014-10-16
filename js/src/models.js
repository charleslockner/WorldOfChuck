/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

Portal.prototype.initModels = function() {
   var self = this;
   this.models = {};

   this.loadModel("assets/cube.json", function(model) {
      self.models.cube = model;
   });
   this.loadModel("assets/sphere.json", function(model) {
      self.models.sphere = model;
   });
   this.loadModel("assets/cube.json", function(model) {
      self.models.pillar = model;
   });
}

Portal.prototype.loadModel = function(path, callback) {
   var self = this;

   $.getJSON(path, function(json) {
      console.log(json.faces.length);
      var model = {
         faces : json.faces.length/3,
         vbo : self.gl.createBuffer(),
         nbo : self.gl.createBuffer(),
         ibo : self.gl.createBuffer()
      }

      // vertex positions
      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, model.vbo);
      self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(json.vertices), self.gl.STATIC_DRAW);

      // vertex normals
      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, model.nbo);
      self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(json.normals), self.gl.STATIC_DRAW);

      // indices to vertices
      self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, model.ibo);
      self.gl.bufferData(self.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(json.faces), self.gl.STATIC_DRAW);

      callback(model);
      console.log(path + " loaded.");
   });
}
