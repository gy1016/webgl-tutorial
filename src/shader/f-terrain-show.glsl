precision mediump float;
uniform vec2 u_RangeX;
uniform vec2 u_RangeY;
uniform sampler2D u_Sampler;
varying vec4 v_Color;
varying vec4 v_position;
void main() {
  vec2 v_TexCoord = vec2((v_position.x-u_RangeX[0]) / (u_RangeX[1]-u_RangeX[0]), 1.0-(v_position.y-u_RangeY[0]) / (u_RangeY[1]-u_RangeY[0]));
  gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}