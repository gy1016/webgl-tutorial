attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
uniform vec4 u_Eye;
varying vec4 v_Color;
varying float v_Dist;
void main() {
  gl_Position = u_MvpMatrix * a_Position;
  v_Color = a_Color;
  v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);
}