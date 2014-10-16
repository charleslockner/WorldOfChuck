precision mediump float;
varying vec3 vWorldNormal;

void main(void) {
	gl_FragColor = vec4(vWorldNormal, 1.0);
}