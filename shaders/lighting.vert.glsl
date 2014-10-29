attribute vec2 aClipPosition;
varying vec2 vTextureCoord;

void main() {
   gl_Position = vec4(aClipPosition, 0.0, 1.0);
   vTextureCoord = aClipPosition * 0.5 + 0.5;
}