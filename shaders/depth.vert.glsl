    attribute vec4 aVertexPosition;
    varying vec2 vTextureCoord;

    void main() {
      gl_Position = aVertexPosition;
      vTextureCoord = aVertexPosition.xy * 0.5 + 0.5;
    }