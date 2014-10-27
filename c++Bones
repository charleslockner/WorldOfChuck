#version 120

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjM;
uniform mat4 uViewM;
uniform mat4 uModelM;

attribute vec2 aBoneIndices;
attribute vec2 aBoneWeights;
uniform mat4 uBoneM[50];

void main() {
   vec3 pos, nNormal;
   float outlineWidth = 5.0;

   mat4 animBones, animBone1, animBone2, compModel;
   vec3 diffuse, specular, ambient, camDiff;
   float camDist;

   // Won't work, but replace this with aBoneWeights.x...
   animBone1 = 1.0 * uBoneM[int(aBoneIndices.x)];
   animBone2 = 0.0 * uBoneM[int(aBoneIndices.y)];
   if (aBoneWeights.x + aBoneWeights.y == 0.1) {
      animBones = mat4(1.0);
   } else {
   	animBones = animBone1; // add + animBone2
   }
   compModel = uModelM * animBones;

   nNormal = vec3(uModelM * normalize(vec4(aNormal, 0.0)));
   pos = vec3(compModel * vec4(aPosition, 1.0));
   pos = pos + vec3(outlineWidth) * nNormal;

   gl_Position = uProjM * uViewM * vec4(pos, 1.0);
}
