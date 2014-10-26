precision mediump float;

uniform sampler2D uSampler;

varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;


void main(void) {
   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}







// struct Material {
//    vec3 aColor;
//    vec3 dColor;
//    vec3 sColor;
//    float shine;
// };

// uniform Material uMat;
// uniform vec3 uLightColor;
// uniform vec3 uSunDir;

// varying vec3 vNormal;
// varying vec3 view;
// varying vec3 reflection;

// void main() {
//    vec3 diffuse, specular, ambient, rColor, nNormal, nSunDir, shadeLow, shadeMed, shadeHigh;
//    float specDot, diffDot;

//    nNormal = normalize(vNormal);
//    nSunDir = normalize(uSunDir);

//    diffuse = dot(nNormal, -nSunDir) * uMat.dColor;
   
//    shadeLow = vec3(0.2, 0.2, 0.2);
//    shadeMed = vec3(0.6, 0.6, 0.6);
//    shadeHigh = vec3(1.0, 1.0, 1.0);
//    diffDot = max(0.0, dot(nNormal, nSunDir));
   
//    if (diffDot < 0.20)
//       diffuse = uMat.dColor * shadeHigh;
//    else if (diffDot < 0.80)
//       diffuse = uMat.dColor * shadeMed;
//    else
//       diffuse = uMat.dColor * shadeLow;
   
//    specDot = max(dot(view, reflection)/(length(view)*length(reflection)), 0.0);
//    specular = pow(specDot, uMat.shine) * uMat.sColor;
//    ambient = uMat.aColor;

//    rColor = uLightColor * (diffuse + specular + ambient);

//    gl_FragColor = vec4(diffuse, 0.0);
// }
