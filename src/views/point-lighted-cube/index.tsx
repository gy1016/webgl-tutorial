import React from 'react';
import { useWebGL, init3DVertexBuffers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-point-lighted.glsl';
import fShader from '@/shader/f-point-lighted.glsl';
import Matrix4 from '@/utils/martix';

let ANGLE_STEP = 30.0;
let currentAngle = 0;
let g_last = Date.now();

function animate(angle: number) {
  let now = Date.now();
  let elapsed = now - g_last;
  g_last = now;
  let newAngle = (angle + (ANGLE_STEP * elapsed) / 1000.0) % 360;
  return newAngle;
}

const PointLightedCube = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      2.0,
      2.0,
      2.0,
      -2.0,
      2.0,
      2.0,
      -2.0,
      -2.0,
      2.0,
      2.0,
      -2.0,
      2.0, // v0-v1-v2-v3 front
      2.0,
      2.0,
      2.0,
      2.0,
      -2.0,
      2.0,
      2.0,
      -2.0,
      -2.0,
      2.0,
      2.0,
      -2.0, // v0-v3-v4-v5 right
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      -2.0,
      -2.0,
      2.0,
      -2.0,
      -2.0,
      2.0,
      2.0, // v0-v5-v6-v1 up
      -2.0,
      2.0,
      2.0,
      -2.0,
      2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      2.0, // v1-v6-v7-v2 left
      -2.0,
      -2.0,
      -2.0,
      2.0,
      -2.0,
      -2.0,
      2.0,
      -2.0,
      2.0,
      -2.0,
      -2.0,
      2.0, // v7-v4-v3-v2 down
      2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      -2.0,
      2.0,
      -2.0,
      2.0,
      2.0,
      -2.0, // v4-v7-v6-v5 back
    ]);

    // Colors
    const colors = new Float32Array([
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v0-v1-v2-v3 front
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v0-v3-v4-v5 right
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v0-v5-v6-v1 up
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v1-v6-v7-v2 left
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v7-v4-v3-v2 down
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // v4-v7-v6-v5 back
    ]);

    // Normal
    const normals = new Float32Array([
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0, // v0-v3-v4-v5 right
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v0-v5-v6-v1 up
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0, // v1-v6-v7-v2 left
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0, // v7-v4-v3-v2 down
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0, // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // right
      8,
      9,
      10,
      8,
      10,
      11, // up
      12,
      13,
      14,
      12,
      14,
      15, // left
      16,
      17,
      18,
      16,
      18,
      19, // down
      20,
      21,
      22,
      20,
      22,
      23, // back
    ]);

    const n = init3DVertexBuffers(gl, vertices, colors, indices, normals);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

    // Set the light color (white)
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    const modelMatrix = new Matrix4(); // Model matrix
    const mvpMatrix = new Matrix4(); // Model view projection matrix
    const normalMatrix = new Matrix4(); // Transformation matrix for normals

    const tick = () => {
      currentAngle = animate(currentAngle);
      modelMatrix.setRotate(currentAngle, 0, 1, 0); // Rotate around the y-axis
      mvpMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 100);
      mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
      mvpMatrix.multiply(modelMatrix);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();

      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

      requestAnimationFrame(tick);
    };

    tick();
  };

  return <MyCanvas main={main} />;
};

export default PointLightedCube;
