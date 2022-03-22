import React from 'react';
import { useWebGL, initVertexBuffers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-alpha-blending.glsl';
import fShader from '@/shader/f-alpha-blending.glsl';
import Matrix4 from '@/utils/martix';

let g_eyeX = 0.2;
let g_eyeY = 0.25;
let g_eyeZ = 0.25;

const AlphaBlending = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const n = initVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 1);
    // Enable alpha blending
    gl.enable(gl.BLEND);
    // Set blending function
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  function initVertexBuffers(gl: IWebGLCtx) {
    let verticesColors = new Float32Array([
      // Vertex coordinates and color(RGBA)
      0.0,
      0.5,
      -0.4,
      0.4,
      1.0,
      0.4,
      0.4, // The back green one
      -0.5,
      -0.5,
      -0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      0.5,
      -0.5,
      -0.4,
      1.0,
      0.4,
      0.4,
      0.4,

      0.5,
      0.4,
      -0.2,
      1.0,
      0.4,
      0.4,
      0.4, // The middle yerrow one
      -0.5,
      0.4,
      -0.2,
      1.0,
      1.0,
      0.4,
      0.4,
      0.0,
      -0.6,
      -0.2,
      1.0,
      1.0,
      0.4,
      0.4,

      0.0,
      0.5,
      0.0,
      0.4,
      0.4,
      1.0,
      0.4, // The front blue one
      -0.5,
      -0.5,
      0.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.5,
      -0.5,
      0.0,
      1.0,
      0.4,
      0.4,
      0.4,
    ]);
    let n = 9;

    // Create a buffer object
    let vertexColorbuffer = gl.createBuffer();
    if (!vertexColorbuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Write the vertex information and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    let FSIZE = verticesColors.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
  }

  return <MyCanvas main={main} />;
};

export default AlphaBlending;
