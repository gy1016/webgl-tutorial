import React from 'react';
import { useWebGL, init3DVertexBuffers, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-fog.glsl';
import fShader from '@/shader/f-fog.glsl';
import Matrix4 from '@/utils/martix';

const Fog = () => {
  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1, // v0-v1-v2-v3 front
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1, // v0-v3-v4-v5 right
      1,
      1,
      1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1, // v0-v5-v6-v1 up
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1, // v1-v6-v7-v2 left
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      -1,
      -1,
      1, // v7-v4-v3-v2 down
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1, // v4-v7-v6-v5 back
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
      1.0, // v0-v1-v2-v3 front
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
      0.4, // v0-v3-v4-v5 right
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
      0.4, // v0-v5-v6-v1 up
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
    if (n < 1) {
      console.log('Failed to set the vertex information');
      return;
    }

    // Color of Fog
    let fogColor = new Float32Array([0.137, 0.231, 0.423]);
    // Distance of fog [where fog starts, where fog completely covers object]
    let fogDist = new Float32Array([55, 80]);
    // Position of eye point (world coordinates)
    let eye = new Float32Array([25, 65, 35, 1.0]);

    // Get the storage locations of uniform letiables
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    let u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
    let u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
    let u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
    if (!u_MvpMatrix || !u_ModelMatrix || !u_Eye || !u_FogColor || !u_FogDist) {
      console.log('Failed to get the storage location');
      return;
    }

    // Pass fog color, distances, and eye point to uniform letiable
    gl.uniform3fv(u_FogColor, fogColor); // Colors
    gl.uniform2fv(u_FogDist, fogDist); // Starting point and end point
    gl.uniform4fv(u_Eye, eye); // Eye point

    // Set clear color and enable hidden surface removal
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0); // Color of Fog
    gl.enable(gl.DEPTH_TEST);

    // Pass the model matrix to u_ModelMatrix
    let modelMatrix = new Matrix4();
    modelMatrix.setScale(10, 10, 10);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_MvpMatrix
    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, el.width / el.height, 1, 1000);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    document.onkeydown = function (ev) {
      keydown(ev, gl, n, u_FogDist, fogDist);
    };

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  };

  function keydown(ev: any, gl: IWebGLCtx, n: number, u_FogDist: any, fogDist: any) {
    switch (ev.keyCode) {
      case 38: // Up arrow key -> Increase the maximum distance of fog
        fogDist[1] += 1;
        break;
      case 40: // Down arrow key -> Decrease the maximum distance of fog
        if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
        break;
      default:
        return;
    }
    gl.uniform2fv(u_FogDist, fogDist); // Pass the distance of fog
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }

  return <MyCanvas main={main} />;
};

export default Fog;
