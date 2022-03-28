import React from 'react';
import { useWebGL, initCubeVertexBuffersNoColor, IWebGLCtx } from '@/hooks/useWebGL';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-multijoint-model.glsl';
import fShader from '@/shader/f-multijoint-model.glsl';
import Matrix4 from '@/utils/martix';

let ANGLE_STEP = 3.0; // The increments of rotation angle (degrees)
let g_arm1Angle = 90.0; // The rotation angle of arm1 (degrees)
let g_joint1Angle = 45.0; // The rotation angle of joint1 (degrees)
let g_joint2Angle = 0.0; // The rotation angle of joint2 (degrees)
let g_joint3Angle = 0.0; // The rotation angle of joint3 (degrees

// Coordinate transformation matrix
let g_modelMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();
let g_normalMatrix = new Matrix4();
let g_matrixStack: Matrix4[] = [];

const MultiJoint = () => {
  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);
    const vertices = new Float32Array([
      0.5,
      1.0,
      0.5,
      -0.5,
      1.0,
      0.5,
      -0.5,
      0.0,
      0.5,
      0.5,
      0.0,
      0.5, // v0-v1-v2-v3 front
      0.5,
      1.0,
      0.5,
      0.5,
      0.0,
      0.5,
      0.5,
      0.0,
      -0.5,
      0.5,
      1.0,
      -0.5, // v0-v3-v4-v5 right
      0.5,
      1.0,
      0.5,
      0.5,
      1.0,
      -0.5,
      -0.5,
      1.0,
      -0.5,
      -0.5,
      1.0,
      0.5, // v0-v5-v6-v1 up
      -0.5,
      1.0,
      0.5,
      -0.5,
      1.0,
      -0.5,
      -0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      0.5, // v1-v6-v7-v2 left
      -0.5,
      0.0,
      -0.5,
      0.5,
      0.0,
      -0.5,
      0.5,
      0.0,
      0.5,
      -0.5,
      0.0,
      0.5, // v7-v4-v3-v2 down
      0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      -0.5,
      -0.5,
      1.0,
      -0.5,
      0.5,
      1.0,
      -0.5, // v4-v7-v6-v5 back
    ]);

    // Normal
    const normals = new Float32Array([
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0, // v0-v1-v2-v3 front
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0, // v0-v3-v4-v5 right
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0, // v0-v5-v6-v1 up
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0, // v1-v6-v7-v2 left
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0, // v7-v4-v3-v2 down
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0, // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
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

    const n = initCubeVertexBuffersNoColor(gl, vertices, indices, normals);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_MvpMatrix || !u_NormalMatrix) {
      console.log('Failed to get the storage location');
      return;
    }

    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, el.width / el.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    document.onkeydown = function (ev: any) {
      keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    };

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  };

  const draw = (
    gl: IWebGLCtx,
    n: number,
    viewProjMatrix: Matrix4,
    u_MvpMatrix: WebGLUniformLocation,
    u_NormalMatrix: WebGLUniformLocation,
  ) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw a base
    let baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // Arm1
    let arm1Length = 10.0;
    g_modelMatrix.translate(0.0, baseHeight, 0.0); // Move onto the base
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // Arm2
    let arm2Length = 10.0;
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); // Rotate around the z-axis
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // A palm
    let palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0); // Move to palm
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // Move to the center of the tip of the palm
    g_modelMatrix.translate(0.0, palmLength, 0.0);

    // Draw finger1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix() as Matrix4;

    // Draw finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  };

  const pushMatrix = (m: Matrix4) => {
    const m2 = new Matrix4(m);
    g_matrixStack.push(m2);
  };

  const popMatrix = () => {
    return g_matrixStack.pop();
  };

  const drawBox = (
    gl: IWebGLCtx,
    n: number,
    width: number,
    height: number,
    depth: number,
    viewProjMatrix: Matrix4,
    u_MvpMatrix: WebGLUniformLocation,
    u_NormalMatrix: WebGLUniformLocation,
  ) => {
    pushMatrix(g_modelMatrix); // Save the model matrix
    // Scale a cube and draw
    g_modelMatrix.scale(width, height, depth);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix() as Matrix4; // Retrieve the model matrix
  };

  const keydown = (
    ev: any,
    gl: IWebGLCtx,
    n: number,
    viewProjMatrix: Matrix4,
    u_MvpMatrix: WebGLUniformLocation,
    u_NormalMatrix: WebGLUniformLocation,
  ) => {
    switch (ev.keyCode) {
      case 40: // Up arrow key -> the positive rotation of joint1 around the z-axis
        if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
        break;
      case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
        if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
        break;
      case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
      case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
        g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
        break;
      case 90: // 'ｚ'key -> the positive rotation of joint2
        g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
        break;
      case 88: // 'x'key -> the negative rotation of joint2
        g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
        break;
      case 86: // 'v'key -> the positive rotation of joint3
        if (g_joint3Angle < 60.0) g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
        break;
      case 67: // 'c'key -> the nagative rotation of joint3
        if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
        break;
      default:
        return; // Skip drawing at no effective action
    }
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  };

  return <MyCanvas main={main} msg="上下左右,zx,cv控制模型" />;
};

export default MultiJoint;
