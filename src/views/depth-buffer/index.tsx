import React from 'react';
import { useWebGL, initVertexBuffers } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-depth-buffer.glsl';
import fShader from '@/shader/f-depth-buffer.glsl';
import Matrix4 from '@/utils/martix';

const DepthBuffer = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates and color
      0.0,
      1.0,
      0.0,
      0.4,
      0.4,
      1.0, // The front blue one
      -0.5,
      -1.0,
      0.0,
      0.4,
      0.4,
      1.0,
      0.5,
      -1.0,
      0.0,
      1.0,
      0.4,
      0.4,

      0.0,
      1.0,
      -2.0,
      1.0,
      1.0,
      0.4, // The middle yellow one
      -0.5,
      -1.0,
      -2.0,
      1.0,
      1.0,
      0.4,
      0.5,
      -1.0,
      -2.0,
      1.0,
      0.4,
      0.4,

      0.0,
      1.0,
      -4.0,
      0.4,
      1.0,
      0.4, // The back green one
      -0.5,
      -1.0,
      -4.0,
      0.4,
      1.0,
      0.4,
      0.5,
      -1.0,
      -4.0,
      1.0,
      0.4,
      0.4,
    ]);
    const n = initVertexBuffers(gl, vertices, 9, 3, 6, 3);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    const modelMatrix = new Matrix4(); // Model matrix
    const viewMatrix = new Matrix4(); // View matrix
    const projMatrix = new Matrix4(); // Projection matrix
    const mvpMatrix = new Matrix4(); // Model view projection matrix
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 100);
    mvpMatrix.set(projMatrix)?.multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    modelMatrix.setTranslate(-0.75, 0, 0);
    mvpMatrix.set(projMatrix)?.multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  return <MyCanvas main={main} />;
};

export default DepthBuffer;
