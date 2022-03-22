import React from 'react';
import { useWebGL, initCubeWithFace, animate, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-pick-face.glsl';
import fShader from '@/shader/f-pick-face.glsl';
import Matrix4 from '@/utils/martix';

const PickFace = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl } = useWebGL(canvasEle, vShader, fShader);
    const n = initCubeWithFace(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    const u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace');
    if (!u_MvpMatrix || !u_PickedFace) {
      console.log('Failed to get the storage location of uniform variable');
      return;
    }

    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvasEle.width / canvasEle.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    gl.uniform1i(u_PickedFace, -1);

    let currentAngle = 0.0; // Current rotation angle
    canvasEle.onmousedown = function (ev: any) {
      let x = ev.clientX;
      let y = ev.clientY;
      const rect = ev.target.getBoundingClientRect();
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        let x_in_canvas = x - rect.left;
        let y_in_canvas = rect.bottom - y;
        const face = checkFace(
          gl,
          n,
          x_in_canvas,
          y_in_canvas,
          currentAngle,
          u_PickedFace,
          viewProjMatrix,
          u_MvpMatrix,
        );
        console.log(face);
        gl.uniform1i(u_PickedFace, face);
        draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
      }
    };

    const tick = () => {
      currentAngle = animate(currentAngle);
      draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
      requestAnimationFrame(tick);
    };
    tick();
  };

  const checkFace = (
    gl: IWebGLCtx,
    n: number,
    x: number,
    y: number,
    currentAngle: number,
    u_PickedFace: WebGLUniformLocation,
    viewProjMatrix: Matrix4,
    u_MvpMatrix: WebGLUniformLocation,
  ) => {
    const pixels = new Uint8Array(4);

    gl.uniform1i(u_PickedFace, 0);
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);

    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    return pixels[3];
  };

  const g_MvpMatrix = new Matrix4();
  const draw = (
    gl: IWebGLCtx,
    n: number,
    currentAngle: number,
    viewProjMatrix: Matrix4,
    u_MvpMatrix: WebGLUniformLocation,
  ) => {
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0); // Rotate appropriately
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffers
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0); // Draw
  };

  return <MyCanvas main={main} />;
};

export default PickFace;
