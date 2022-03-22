import React from 'react';
import { useWebGL, initVertexBuffers } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-rounded-points.glsl';
import fShader from '@/shader/f-rounded-points.glsl';

const RoundedPoints = () => {
  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);
    const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const n = initVertexBuffers(gl, vertices, 3, 2, 0, 0);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }

    gl.clearColor(0, 0, 0, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);
  };

  return <MyCanvas main={main} />;
};

export default RoundedPoints;
