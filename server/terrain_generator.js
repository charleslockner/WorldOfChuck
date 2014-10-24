/*  __________________________________________________________________________
   |                       World-of-Chuck Portal Project                      |
   |                            By Charles Lockner                            |
   |                                                                          |
   | Anyone can use this. Just be sure to credit me by either including       |
   | this header or simply stating that your work uses some of this code. :D  |
   |__________________________________________________________________________| */


require('sylvester');

var width;
var height;

module.exports.createTile = function(preMap, widthP, heightP, subDivs, roughness) {
   width = widthP;
   height = heightP;
   var sideVerts = Math.pow(2, subDivs) + 1;
   preMap = sanitizeArray(preMap);
   var hMap = generateMap(roughness, preMap);
   var positions = setPositions(hMap);
   var indices = setIndices(hMap);
   var normals = setNormals(hMap, positions);

   return {
      "vertices": positions,
      "normals": normals,
      "colors": [],
      "uvs": [],
      "faces": indices,
      "heightMap": hMap,
      "roughness": roughness,
      "xWidth": width,
      "zWidth": width,
      "height": height
   };
}

var sanitizeArray = function(arr, sideVerts) {
   return arr ? arr : module.exports.createEmptyArray(sideVerts);
}

module.exports.createEmptyArray = function(sideVerts) {
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
   return  randomness * (2 * Math.random() - 1);
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
         var mPos = $V([positions[3*m], positions[3*m+1], positions[3*m+2]]);
         var tPos = (z > 0) ? $V([positions[3*t], positions[3*t+1], positions[3*t+2]]) : null;
         var bPos = (z < vertsAcross - 1) ? $V([positions[3*b], positions[3*b+1], positions[3*b+2]]) : null;
         var lPos = (x > 0) ? $V([positions[3*l], positions[3*l+1], positions[3*l+2]]) : null;
         var rPos = (x < vertsAcross - 1) ? $V([positions[3*r], positions[3*r+1], positions[3*r+2]]) : null;

         // Determine directional vectors from center to outer vertices
         var tVec = tPos ? tPos.subtract(mPos).toUnitVector() : null;
         var bVec = bPos ? bPos.subtract(mPos).toUnitVector() : null;
         var lVec = lPos ? lPos.subtract(mPos).toUnitVector() : null;
         var rVec = rPos ? rPos.subtract(mPos).toUnitVector() : null;

         // Determine surrounding face normals
         var tlNorm = (tVec && lVec) ? lVec.cross(tVec).toUnitVector() : null;
         var trNorm = (tVec && rVec) ? tVec.cross(rVec).toUnitVector() : null;
         var blNorm = (bVec && lVec) ? bVec.cross(lVec).toUnitVector() : null;
         var brNorm = (bVec && rVec) ? rVec.cross(bVec).toUnitVector() : null;

         // Average face normals
         var normal = $V([0,0,0]);
         if (tlNorm) normal = normal.add(tlNorm);
         if (trNorm) normal = normal.add(trNorm);
         if (blNorm) normal = normal.add(blNorm);
         if (brNorm) normal = normal.add(brNorm);
         normal = normal.toUnitVector();

         // Add normal to normal array
         normals.push(normal.elements[0]);
         normals.push(normal.elements[1]);
         normals.push(normal.elements[2]);
      }

   return normals;
}
