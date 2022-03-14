attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewProjMatrix;
varying vec4 v_Color;
void main() {
  gl_Position = u_ViewProjMatrix * a_Position;
  v_Color = a_Color;
}
