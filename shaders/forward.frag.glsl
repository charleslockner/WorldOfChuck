precision mediump float;

// struct Material {
//    vec3 aColor;
//    vec3 dColor;
//    vec3 sColor;
//    float shine;
// };

uniform vec3 uCameraPosition;
uniform sampler2D uSampler;
// uniform float uMaterial;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;


void main(void) {
   vec3 texColor, normal, reflection, view, ambient, diffuse, specular, rColor;
   float specDot;

   vec3 lightColor, lightDirection, lightPosition;
   float shine;

   lightColor = vec3(1.0, 1.0, 1.0);
   lightDirection = normalize(vec3(-0.5, -0.8, -1.0));
   normal = normalize(vWorldNormal);
   reflection = normalize(2.0 * normal * dot(normal, lightDirection) - lightDirection);
   view = normalize(vWorldPosition - uCameraPosition);
   shine = 1000.0;

   texColor = vec3(texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)));

   ambient = texColor * 0.85;
   diffuse = texColor * dot(normal, -lightDirection);
   specular = texColor * pow(max(0.0, dot(reflection, view)), shine);
   rColor = lightColor * (diffuse + specular + ambient);

   gl_FragColor = vec4(rColor, 1.0);
}