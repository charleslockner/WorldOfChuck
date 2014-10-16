attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform int uFlags;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec3 vWorldNormal;

void main(void) {
   vec4 normal;
   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
   normal = vec4(aVertexNormal, 0.0);
   vWorldNormal = vec3(uModelMatrix * normalize(normal));
}

