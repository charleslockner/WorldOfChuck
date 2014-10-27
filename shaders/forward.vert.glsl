uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;

void main(void) {
   vWorldPosition = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
   vWorldNormal = vec3(uModelMatrix * normalize(vec4(aVertexNormal, 0.0)));
   vTextureCoord = aTextureCoord;

	gl_Position = uProjectionMatrix * uViewMatrix * vec4(vWorldPosition, 1.0);
}






// attribute vec3 aPosition;
// attribute vec3 aNormal;

// uniform mat4 uProjM;
// uniform mat4 uViewM;
// uniform mat4 uModelM;

// uniform vec3 uCamPos;
// uniform vec3 uSunDir;

// varying vec3 vColor;
// varying vec3 vNormal;

// varying vec3 view;
// varying vec3 reflection;

// void main() {
//    vec3 diffuse, specular, ambient, camDiff, pos;
//    float camDist;

//    vNormal = vec3(uModelM * normalize(vec4(aNormal, 0.0)));
//    pos = vec3(uModelM * vec4(aPosition, 1.0));

//    view = normalize(uCamPos - pos);
//    reflection = uSunDir - 2.0 * dot(uSunDir, vNormal) * vNormal;

//    gl_Position = uProjM * uViewM * vec4(pos, 1.0);
// }

