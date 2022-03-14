import React from 'react';
import { useWebGL, initVertexBuffers } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-polygon-offset.glsl';
import fShader from '@/shader/f-polygon-offset.glsl';
import Matrix4 from '@/utils/martix';

const PolygonOffset = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl }: any = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates and color
      0.0,
      2.5,
      -5.0,
      0.4,
      1.0,
      0.4, // The green triangle
      -2.5,
      -2.5,
      -5.0,
      0.4,
      1.0,
      0.4,
      2.5,
      -2.5,
      -5.0,
      1.0,
      0.4,
      0.4,

      0.0,
      3.0,
      -5.0,
      1.0,
      0.4,
      0.4, // The yellow triagle
      -3.0,
      -3.0,
      -5.0,
      1.0,
      1.0,
      0.4,
      3.0,
      -3.0,
      -5.0,
      1.0,
      1.0,
      0.4,
    ]);
    const n = initVertexBuffers(gl, vertices, 6, 3, 6, 3);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    const u_ViewProjMatrix = gl.getUniformLocation(gl.program, 'u_ViewProjMatrix');
    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 100);
    viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable the polygon offset function
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.drawArrays(gl.TRIANGLES, 0, n / 2); // The green triangle
    gl.polygonOffset(1.0, 1.0); // Set the polygon offset
    gl.drawArrays(gl.TRIANGLES, n / 2, n / 2); // The yellow triangle
  };

  return <MyCanvas main={main} />;
};

export default PolygonOffset;
