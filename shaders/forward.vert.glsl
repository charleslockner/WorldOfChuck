
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