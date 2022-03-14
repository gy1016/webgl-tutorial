/* eslint-disable max-params */
import React from 'react';
import { useWebGL, initVertexBuffers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-look-at-triangle.glsl';
import fShader from '@/shader/f-look-at-triangle.glsl';
import Matrix4 from '@/utils/martix';

let g_eyeX = 0.2;
let g_eyeY = 0.25;
let g_eyeZ = 0.25;

const LookAtTriangle = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates and color
      0.0,
      0.5,
      -0.4,
      0.4,
      1.0,
      0.4, // The back green one
      -0.5,
      -0.5,
      -0.4,
      0.4,
      1.0,
      0.4,
      0.5,
      -0.5,
      -0.4,
      1.0,
      0.4,
      0.4,

      0.5,
      0.4,
      -0.2,
      1.0,
      0.4,
      0.4, // The middle yellow one
      -0.5,
      0.4,
      -0.2,
      1.0,
      1.0,
      0.4,
      0.0,
      -0.6,
      -0.2,
      1.0,
      1.0,
      0.4,

      0.0,
      0.5,
      0.0,
      0.4,
      0.4,
      1.0, // The front blue one
      -0.5,
      -0.5,
      0.0,
      0.4,
      0.4,
      1.0,
      0.5,
      -0.5,
      0.0,
      1.0,
      0.4,
      0.4,
    ]);
    const n = initVertexBuffers(gl, vertices, 9, 3, 6, 3);
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_ViewMatrix || !u_ProjMatrix) {
      console.log('Failed to get the storage locations of u_ViewMatrix');
      return;
    }
    const viewMatrix = new Matrix4();
    const projMatrix = new Matrix4();
    projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    draw(gl, n, u_ViewMatrix, viewMatrix);
    document.onkeydown = function (ev) {
      keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    };
  };

  function keydown(
    ev: KeyboardEvent,
    gl: IWebGLCtx,
    n: number,
    u_ViewMatrix: WebGLUniformLocation,
    viewMatrix: Matrix4,
  ) {
    if (ev.keyCode === 39) {
      // The right arrow key was pressed
      g_eyeX += 0.01;
    } else if (ev.keyCode === 37) {
      // The left arrow key was pressed
      g_eyeX -= 0.01;
    } else {
      return;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
  }

  const draw = (gl: IWebGLCtx, n: number, u_ViewMatrix: WebGLUniformLocation, viewMatrix: Matrix4) => {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  return <MyCanvas main={main} />;
};

export default LookAtTriangle;
