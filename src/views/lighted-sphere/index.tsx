import React, { useEffect } from 'react';
import { useWebGL, initCircleVertexBuffers, initTextures, initEventHndlers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-lighted-sphere.glsl';
import fShader from '@/shader/f-lighted-sphere.glsl';
import Matrix4 from '@/utils/martix';
import earth from '@/assets/earth.jpg';

const LightedShpere = () => {
  let timer: any = null;
  useEffect(() => {
    return () => window.cancelAnimationFrame(timer);
  }, []);

  const main = (canvasEle: HTMLCanvasElement) => {
    const currentAngle = [0, 0];

    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const n = initCircleVertexBuffers(gl, 150);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location');
      return;
    }
    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvasEle.width / canvasEle.height, 1, 100);
    mvpMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    initEventHndlers(canvasEle, currentAngle);

    // mvpMatrix.multiply(modelMatrix);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const tick = () => {
      draw(gl, n, mvpMatrix, currentAngle, u_MvpMatrix);
      timer = requestAnimationFrame(tick);
    };
    tick();
  };

  let g_MvpMatrix = new Matrix4(); // Model view projection matrix
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

    if (!initTextures(gl, n, earth)) {
      console.log('无法配置纹理');
      return;
    }
  };

  return <MyCanvas main={main} />;
};

export default LightedShpere;
