import React from 'react';
import { useWebGL, initVertexBuffers } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-hello-triangle.glsl';
import fShader from '@/shader/f-hello-triangle.glsl';

const HelloTriangle = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl, a_Position, a_Color }: any = useWebGL(canvasEle, vShader, fShader);
    const n = initVertexBuffers(gl, a_Position, a_Color);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  };

  return <MyCanvas main={main} />;
};

export default HelloTriangle;
