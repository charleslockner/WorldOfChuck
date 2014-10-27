uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;

void main(void) {
   vec4 normal;
   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

   normal = normalize(vec4(aVertexNormal, 0.0));
   vWorldNormal = vec3(uModelMatrix * normal);

   vTextureCoord = aTextureCoord;
}

