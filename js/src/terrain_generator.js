/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


var TerrainGenerator = function(width, height, subDivs) {
   this.width = width;
   this.height = height;
   this.sideVerts = Math.pow(2, subDivs) + 1;
}

// Returns a JSON object
TerrainGenerator.prototype.createRandom = function(initMap) {
   var rand = Math.random();
   if (rand < 1/3)
      return this.createPlains(initMap);
   else if (rand < 2/3)
      return this.createHills(initMap);
   else
      return this.createMountains(initMap);
}

// Returns a JSON object
TerrainGenerator.prototype.createMountains = function(initMap) {
   var preMap = this.sanitizeArray(initMap);
   return this.create(preMap, this.height, 0.25);
}

// Returns a JSON object
TerrainGenerator.prototype.createHills = function(initMap) {
   var preMap = this.sanitizeArray(initMap);
   return this.create(preMap, this.height, 0.10);
}

// Returns a JSON object
TerrainGenerator.prototype.createPlains = function(initMap) {
   var preMap = this.sanitizeArray(initMap);
   return this.create(preMap, this.height, 0.04)
}

TerrainGenerator.prototype.sanitizeArray = function(arr) {
   return arr ? arr : this.createEmptyArray();
}

TerrainGenerator.prototype.createEmptyArray = function() {
   var arr = new Array(this.sideVerts);
   for (var x = 0; x < this.sideVerts; x++)
      arr[x] = new Float32Array(this.sideVerts);

   return arr;
}

TerrainGenerator.prototype.create = function(preMap, height, rough) {
   var hMap = this.generateSquare(rough, preMap);
   var positions = this.setPositions(hMap, height);
   var indices = this.setIndices(hMap);
   var normals = this.setNormals(hMap, positions);

   terr = {
      "vertices": positions,
      "normals": normals,
      "colors": [],
      "uvs": [],
      "faces": indices,
      "bones": [],
      "boneWeights": [],
      "boneIndices": [],
      "animations": {},
      "heightMap": hMap
   }

   return terr;
}

// Creates a height-map with random values between 0 and 1 using the diamond-square algorithm
TerrainGenerator.prototype.generateSquare = function(rough, arr) {   
   var xF = 0;
   var xL = arr.length-1;
   var yF = 0;
   var yL = arr.length-1;

   var aveHeight = 0;
   var count = 0;

   for (var x = xF; x <= xL; x++)
      for (var y = yF; y <= yL; y++)
         if (arr[x][y]) {
            aveHeight += arr[x][y];
            count++;
         }

   if (count)
      aveHeight /= count;

   if (!arr[xF][yF])
      arr[xF][yF] = aveHeight + this.jitter(rough);
   if (!arr[xL][yF])
      arr[xL][yF] = aveHeight + this.jitter(rough);
   if (!arr[xF][yL])
      arr[xF][yL] = aveHeight + this.jitter(rough);
   if (!arr[xL][yL])
      arr[xL][yL] = aveHeight + this.jitter(rough);

   this.fillSquare(arr, xF, xL, yF, yL, rough);
   return arr;
}

TerrainGenerator.prototype.jitter = function(randomness) {
   return  randomness * randRange(-1, 1);
}

TerrainGenerator.prototype.fillSquare = function(arr, xF, xL, yF, yL, rough) {
   var dist = xL - xF;

   if (dist > 1) {
      var randomness = rough * dist / (arr.length - 1);
      var xMid = (xF + xL) / 2;
      var yMid = (yF + yL) / 2;

      if (!arr[xMid][yMid]); // mid height
         arr[xMid][yMid] = (arr[xF][yF] + arr[xL][yF] + arr[xF][yL] + arr[xL][yL]) / 4 + this.jitter(randomness);
      if (!arr[xMid][yF]) // top height
         arr[xMid][yF] = (arr[xF][yF] + arr[xL][yF]) / 2 + this.jitter(randomness);
      if (!arr[xMid][yL]) // bot height
         arr[xMid][yL] = (arr[xF][yL] + arr[xL][yL]) / 2 + this.jitter(randomness);
      if (!arr[xF][yMid]) // left height
         arr[xF][yMid] = (arr[xF][yF] + arr[xF][yL]) / 2 + this.jitter(randomness);
      if (!arr[xL][yMid]) // right height
         arr[xL][yMid] = (arr[xL][yF] + arr[xL][yL]) / 2 + this.jitter(randomness);

      this.fillSquare(arr, xF, xMid, yF, yMid, rough); // recurse top left square
      this.fillSquare(arr, xMid, xL, yF, yMid, rough); // recurse top right square
      this.fillSquare(arr, xF, xMid, yMid, yL, rough); // recurse bottom left square
      this.fillSquare(arr, xMid, xL, yMid, yL, rough); // recurse bottome right square
   }
}

TerrainGenerator.prototype.setPositions = function(hMap, height) {
   var vertsAcross = hMap.length;
   var subWidth = this.width / (vertsAcross-1);
   var positions = [];

   for (var x = 0; x < vertsAcross; x++)
      for (var z = 0; z < vertsAcross; z++) {
         var xPos = subWidth * ((1 - vertsAcross)/2 + x);
         var yPos = height * (hMap[x][z] - 0.5);
         var zPos = subWidth * ((1 - vertsAcross)/2 + z);

         positions.push(xPos);
         positions.push(yPos);
         positions.push(zPos);
      }

   return positions;
}

TerrainGenerator.prototype.setIndices = function(hMap) {
   var vertsAcross = hMap.length;
   var indices = [];

   for (var x = 0; x < vertsAcross-1; x++)
      for (var z = 0; z < vertsAcross-1; z++) {
         var tl = vertsAcross * z + x;
         var tr = tl + 1;
         var bl = tl + vertsAcross;
         var br = bl + 1;

         // Push top left triangle
         indices.push(tl);
         indices.push(tr);
         indices.push(bl);

         // Push bottom right triangle
         indices.push(tr);
         indices.push(br);
         indices.push(bl);
      }

   return indices;
}

TerrainGenerator.prototype.setNormals = function(hMap, positions) {
   var vertsAcross = hMap.length;
   var normals = [];

   for (var x = 0; x < vertsAcross; x++)
      for (var z = 0; z < vertsAcross; z++) {
         var m = vertsAcross * z + x;
         var t = m - vertsAcross;
         var b = m + vertsAcross;
         var l = m - 1;
         var r = m + 1;

         // Determine positions of outer vertices
         var mPos = vec3.fromValues(positions[3*m], positions[3*m+1], positions[3*m+2]);
         var tPos = (z > 0) ? vec3.fromValues(positions[3*t], positions[3*t+1], positions[3*t+2]) : null;
         var bPos = (z < vertsAcross - 1) ? vec3.fromValues(positions[3*b], positions[3*b+1], positions[3*b+2]) : null;
         var lPos = (x > 0) ? vec3.fromValues(positions[3*l], positions[3*l+1], positions[3*l+2]) : null;
         var rPos = (x < vertsAcross - 1) ? vec3.fromValues(positions[3*r], positions[3*r+1], positions[3*r+2]) : null;

         // Determine directional vectors from center to outer vertices
         var tVec = {}; tVec = tPos ? vec3.sub(tVec, tPos, mPos) : null;
         var bVec = {}; bVec = bPos ? vec3.sub(bVec, bPos, mPos) : null;
         var lVec = {}; lVec = lPos ? vec3.sub(lVec, lPos, mPos) : null;
         var rVec = {}; rVec = rPos ? vec3.sub(rVec, rPos, mPos) : null;

         // Determine surrounding face normals
         // not actually correct, since a face can have two triangles with different normals
         var tlNorm = {};
         if (tVec && lVec) {
            vec3.cross(tlNorm, lVec, tVec);
            vec3.normalize(tlNorm, tlNorm);
         } else tlNorm = null;
         var trNorm = {};
         if (tVec && rVec) {
            vec3.cross(trNorm, tVec, rVec);
            vec3.normalize(trNorm, trNorm);
         } else trNorm = null;
         var blNorm = {};
         if (bVec && lVec) {
            vec3.cross(blNorm, bVec, lVec);
            vec3.normalize(blNorm, blNorm);
         } else blNorm = null;
         var brNorm = {};
         if (bVec && rVec) {
            vec3.cross(brNorm, rVec, bVec);
            vec3.normalize(brNorm, brNorm);
         } else brNorm = null;

         // Average face normals
         var normal = vec3.fromValues(0,0,0);
         if (tlNorm)
            vec3.add(normal, normal, tlNorm);
         if (trNorm)
            vec3.add(normal, normal, trNorm);
         if (blNorm)
            vec3.add(normal, normal, blNorm);
         if (brNorm)
            vec3.add(normal, normal, brNorm);
         vec3.normalize(normal, normal);

         // Add normal to normal array
         normals.push(normal[0]);
         normals.push(normal[1]);
         normals.push(normal[2]);
      }

   return normals;
}
