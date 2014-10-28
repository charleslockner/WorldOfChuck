// #extension GL_EXT_draw_buffers : require

precision mediump float;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main(void) {
	gl_FragColor = vec4(vWorldNormal, 1.0);

   // gl_FragData[0] = vec4(vWorldNormal, 1.0);
   // gl_FragData[1] = vec4(0.25);
   // gl_FragData[2] = vec4(0.75);
   // gl_FragData[3] = vec4(1.0);
}