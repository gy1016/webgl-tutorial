import React from 'react';
import { useWebGL, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-colored-points.glsl';
import fShader from '@/shader/f-colored-points.glsl';

const g_points: [number, number][] = []; // The array for the position of a mouse press
const g_colors: [number, number, number, number][] = []; // The array to store the color of a point

const ColoredPoints = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl, a_Position, u_FragColor }: any = useWebGL(canvasEle, vShader, fShader);
    canvasEle.onmousedown = function (ev) {
      click(ev, gl, canvasEle, a_Position, u_FragColor);
    };
  };

  const click = (
    ev: any,
    gl: IWebGLCtx,
    canvas: HTMLCanvasElement,
    a_Position: number,
    u_FragColor: WebGLUniformLocation,
    // eslint-disable-next-line max-params
  ) => {
    let x = ev.clientX; // x coordinate of a mouse pointer
    let y = ev.clientY; // y coordinate of a mouse pointer
    const rect = ev.target.getBoundingClientRect();

    x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    g_points.push([x, y]);
    if (x >= 0.0 && y >= 0.0) {
      // First quadrant
      g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
    } else if (x < 0.0 && y < 0.0) {
      // Third quadrant
      g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
    } else {
      // Others
      g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
    }

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;
    for (let i = 0; i < len; i++) {
      let xy = g_points[i];
      let rgba = g_colors[i];

      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };

  return <MyCanvas main={main} />;
};

export default ColoredPoints;
