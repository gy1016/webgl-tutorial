import React from 'react';
import { useWebGL, initCircleVertexBuffers, initTextures } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-lighted-sphere.glsl';
import fShader from '@/shader/f-lighted-sphere.glsl';
import Matrix4 from '@/utils/martix';
import earth from '@/assets/earth.jpg';

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

const LightedShpere = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const n = initCircleVertexBuffers(gl, 150);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location');
      return;
    }
    const mvpMatrix = new Matrix4();
    const modelMatrix = new Matrix4();

    currentAngle = animate(currentAngle);
    modelMatrix.setRotate(currentAngle, 0, 1, 0); // Rotate around the y-axis
    mvpMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 100);
    mvpMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!initTextures(gl, n, earth)) {
      console.log('无法配置纹理');
      return;
    }
  };

  return <MyCanvas main={main} />;
};

export default LightedShpere;
