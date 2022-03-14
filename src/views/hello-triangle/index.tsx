import React from 'react';
import { useWebGL, initVertexBuffers } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-hello-triangle.glsl';
import fShader from '@/shader/f-hello-triangle.glsl';

const HelloTriangle = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl }: any = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const n = initVertexBuffers(gl, vertices, 3, 2, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  return <MyCanvas main={main} />;
};

export default HelloTriangle;
