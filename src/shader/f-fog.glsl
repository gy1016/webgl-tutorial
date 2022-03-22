precision mediump float;
uniform vec3 u_FogColor;
uniform vec2 u_FogDist;
varying vec4 v_Color;
varying float v_Dist;
void main() {
  float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
  vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);
  gl_FragColor = vec4(color, v_Color.a);
}
