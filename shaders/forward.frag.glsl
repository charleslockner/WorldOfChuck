precision mediump float;

uniform vec3 uLights[12]; // max 3 lights each with position, direction, color, <strength, atten, radius>
uniform vec3 uCameraPosition;
uniform sampler2D uSampler;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying highp vec2 vTextureCoord;

void main(void) {
   vec3 lightPosition, lightDirection, lightColor, lightAttr;
   vec3 texColor, normal, reflection, view;
   vec3 ambient, diffuse, specular, rColor;
   float specDot, lightStrength, lightAttenuation, lightRadius, lightDistance, illumination;
   float shine;

   texColor = vec3(texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)));
   normal = normalize(vWorldNormal);
   
   view = normalize(vWorldPosition - uCameraPosition);
   shine = 500.0;

   ambient = texColor * 0.25;
   rColor = vec3(0.0);

   // loop through each light
   for (int i = 0; i < 3; i++) {
      lightPosition = uLights[4*i];
      lightDirection = uLights[4*i+1];
      lightColor = uLights[4*i+2];
      lightAttr = uLights[4*i+3];

      lightStrength = lightAttr.x;
      lightAttenuation = lightAttr.y;
      lightRadius = lightAttr.z;

      lightDirection = normalize(vWorldPosition - lightPosition);
      reflection = normalize(2.0 * normal * dot(normal, lightDirection) - lightDirection);
      lightDistance = length(vWorldPosition - lightPosition);
      illumination = lightStrength / (1.0 + 2.0*lightDistance + lightDistance*lightDistance);

      diffuse = texColor * dot(normal, -lightDirection);
      specular = texColor * pow(max(0.0, dot(reflection, view)), shine);
      rColor += illumination * lightColor * (specular + diffuse + ambient);
   }

   gl_FragColor = vec4(rColor, 1.0);
}