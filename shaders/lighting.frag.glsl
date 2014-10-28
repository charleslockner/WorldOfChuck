precision mediump float;

uniform sampler2D uWorldPosition;
uniform sampler2D uWorldNormal;
uniform sampler2D uColor;

varying vec2 vTextureCoord;

void main() {
   vec4 position, normal, color;

   position = texture2D(uWorldPosition, vTextureCoord);
   normal = texture2D(uWorldNormal, vTextureCoord);
   color = texture2D(uColor, vTextureCoord);

   gl_FragColor = position + normal + color;
}