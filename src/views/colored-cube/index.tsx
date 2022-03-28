import React, { useEffect } from 'react';
import { useWebGL, init3DVertexBuffers, initEventHndlers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-colored-cube.glsl';
import fShader from '@/shader/f-colored-cube.glsl';
import Matrix4 from '@/utils/martix';

const ColoredCube = () => {
  let timer: any = null;
  useEffect(() => {
    return () => window.cancelAnimationFrame(timer);
  }, []);

  const main = (canvasEle: HTMLCanvasElement) => {
    const currentAngle = [0, 0];
    initEventHndlers(canvasEle, currentAngle);
    const { gl }: any = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v0-v3-v4-v5 right
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0, // v0-v5-v6-v1 up
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0, // v1-v6-v7-v2 left
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0, // v7-v4-v3-v2 down
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // v4-v7-v6-v5 back
    ]);
    const colors = new Float32Array([
      // Colors
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0, // v0-v1-v2-v3 front(blue)
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4, // v0-v3-v4-v5 right(green)
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4,
      1.0,
      0.4,
      0.4, // v0-v5-v6-v1 up(red)
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4, // v1-v6-v7-v2 left
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0, // v7-v4-v3-v2 down
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0,
      0.4,
      1.0,
      1.0, // v4-v7-v6-v5 back
    ]);
    const indices = new Uint8Array([
      // Indices of the vertices
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
    const n = init3DVertexBuffers(gl, vertices, colors, indices);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }
    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 1000);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    const tick = () => {
      draw(gl, n, mvpMatrix, currentAngle, u_MvpMatrix);
      timer = requestAnimationFrame(tick);
    };

    tick();
  };

  let g_MvpMatrix = new Matrix4();
  const draw = (
    gl: IWebGLCtx,
    n: number,
    mvpMatrix: Matrix4,
    currentAngle: number[],
    u_MvpMatrix: WebGLUniformLocation,
  ) => {
    g_MvpMatrix.set(mvpMatrix);
    g_MvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
    g_MvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  };

  return <MyCanvas main={main} />;
};

export default ColoredCube;
