/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */

var randRange = function(low, high) {
   return (high - low) * Math.random() + low;
}

var width;
var height;
var sideVerts;

module.exports.createTile = function(preMap, width, height, subDivs, roughness) {
   width = width;
   height = height;
   sideVerts = Math.pow(2, subDivs) + 1;

   var hMap = generateMap(roughness, sanitizeArray(preMap));
   var positions = setPositions(hMap, height);
   var indices = setIndices(hMap);
   var normals = setNormals(hMap, positions);

   return {
      "vertices": positions,
      "normals": normals,
      "colors": [],
      "uvs": [],
      "faces": indices,
      "heightMap": hMap,
      "roughness": roughness
   };
}

var sanitizeArray = function(arr) {
   return arr ? arr : createEmptyArray();
}

var createEmptyArray = function() {
   var arr = new Array(sideVerts);
   for (var x = 0; x < sideVerts; x++)
      arr[x] = new Float32Array(sideVerts);

   return arr;
}

// Creates a height-map with random values between 0 and 1 using the diamond-square algorithm
var generateMap = function(roughness, arr) {
   var lastNdx = arr.length-1;
   var aveHeight = averageHeight(arr);

   if (!arr[0][0])
      arr[0][0] = aveHeight + jitter(roughness);
   if (!arr[lastNdx][0])
      arr[lastNdx][0] = aveHeight + jitter(roughness);
   if (!arr[0][lastNdx])
      arr[0][lastNdx] = aveHeight + jitter(roughness);
   if (!arr[lastNdx][lastNdx])
      arr[lastNdx][lastNdx] = aveHeight + jitter(roughness);

   // Recursively fill out array
   generateSubMap(arr, 0, lastNdx, 0, lastNdx, roughness);
   return arr;
}

var averageHeight = function(arr) {
   var aveHeight = 0;
   var count = 0;

   for (var x = 0; x < arr.length; x++)
      for (var y = 0; y < arr.length; y++)
         if (arr[x][y]) {
            aveHeight += arr[x][y];
            count++;
         }

   return count ? aveHeight /= count : 0;
}

var jitter = function(randomness) {
   return  randomness * randRange(-1, 1);
}

var generateSubMap = function(arr, xF, xL, yF, yL, roughness) {
   var dist = xL - xF;

   if (dist > 1) {
      var randomness = roughness * dist / (arr.length - 1);
      var xMid = (xF + xL) / 2;
      var yMid = (yF + yL) / 2;

      if (!arr[xMid][yMid]); // mid height
         arr[xMid][yMid] = (arr[xF][yF] + arr[xL][yF] + arr[xF][yL] + arr[xL][yL]) / 4 + jitter(randomness);
      if (!arr[xMid][yF]) // top height
         arr[xMid][yF] = (arr[xF][yF] + arr[xL][yF]) / 2 + jitter(randomness);
      if (!arr[xMid][yL]) // bot height
         arr[xMid][yL] = (arr[xF][yL] + arr[xL][yL]) / 2 + jitter(randomness);
      if (!arr[xF][yMid]) // left height
         arr[xF][yMid] = (arr[xF][yF] + arr[xF][yL]) / 2 + jitter(randomness);
      if (!arr[xL][yMid]) // right height
         arr[xL][yMid] = (arr[xL][yF] + arr[xL][yL]) / 2 + jitter(randomness);

      generateSubMap(arr, xF, xMid, yF, yMid, roughness); // recurse top left square
      generateSubMap(arr, xMid, xL, yF, yMid, roughness); // recurse top right square
      generateSubMap(arr, xF, xMid, yMid, yL, roughness); // recurse bottom left square
      generateSubMap(arr, xMid, xL, yMid, yL, roughness); // recurse bottome right square
   }
}

var setPositions = function(hMap) {
   var vertsAcross = hMap.length;
   var subWidth = width / (vertsAcross-1);
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
var setIndices = function(hMap) {
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

var setNormals = function(hMap, positions) {
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
