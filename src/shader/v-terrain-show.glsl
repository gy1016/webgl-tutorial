attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
varying vec4 v_Position;
void main() {
  v_Position = a_Position;
  gl_Position = u_MvpMatrix * a_Position;
  v_Color = a_Color;
}
