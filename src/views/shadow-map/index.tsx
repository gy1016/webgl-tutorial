import React, { useEffect } from 'react';
import vShadow from '@/shader/v-shadow.glsl';
import fShadow from '@/shader/f-shadow.glsl';
import vShadowSource from '@/shader/v-shadow-source.glsl';
import fShadowSource from '@/shader/f-shadow-source.glsl';
import MyCanvas from '@/components/my-canvas';
import {
  createProgram,
  IWebGLCtx,
  initVertexBuffersForTriangle,
  initVertexBuffersForPlane,
  initFramebufferObject,
  initAttributeVariable,
  animate,
} from '@/hooks/useWebGL';
import Matrix4 from '@/utils/martix';

const OFFSCREEN_WIDTH = 2048;
const OFFSCREEN_HEIGHT = 2048;
const LIGHT_X = 0;
const LIGHT_Y = 7;
const LIGHT_Z = 2; // Position of the light source

// Coordinate transformation matrix
const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
function drawTriangle(gl: any, program: any, triangle: any, angle: any, viewProjMatrix: any) {
  // Set rotate angle to model matrix and draw triangle
  g_modelMatrix.setRotate(angle, 0, 1, 0);
  draw(gl, program, triangle, viewProjMatrix);
}

function drawPlane(gl: any, program: any, plane: any, viewProjMatrix: any) {
  // Set rotate angle to model matrix and draw plane
  g_modelMatrix.setRotate(-45, 0, 1, 1);
  draw(gl, program, plane, viewProjMatrix);
}

function draw(gl: any, program: any, o: any, viewProjMatrix: any) {
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  if (program.a_Color !== undefined)
    // If a_Color is defined to attribute
    initAttributeVariable(gl, program.a_Color, o.colorBuffer);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

const ShadowMap = () => {
  let timer: any = null;
  useEffect(() => {
    return () => window.cancelAnimationFrame(timer);
  }, []);

  const main = (el: HTMLCanvasElement) => {
    const gl = el.getContext('webgl') as IWebGLCtx;
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
    }

    const shadowProgram: any = createProgram(gl, vShadow, fShadow);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');
    if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
      console.log('Failed to get the storage location of attribute or uniform variable from shadowProgram');
      return;
    }

    // Initialize shaders for regular drawing
    const normalProgram: any = createProgram(gl, vShadowSource, fShadowSource);
    normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
    normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
    normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
    normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
    normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');
    if (
      normalProgram.a_Position < 0 ||
      normalProgram.a_Color < 0 ||
      !normalProgram.u_MvpMatrix ||
      !normalProgram.u_MvpMatrixFromLight ||
      !normalProgram.u_ShadowMap
    ) {
      console.log('Failed to get the storage location of attribute or uniform variable from normalProgram');
      return;
    }

    // Set the vertex information
    const triangle = initVertexBuffersForTriangle(gl);
    const plane = initVertexBuffersForPlane(gl);
    if (!triangle || !plane) {
      console.log('Failed to set the vertex information');
      return;
    }

    // Initialize framebuffer object (FBO)
    const fbo = initFramebufferObject(gl, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    if (!fbo) {
      console.log('Failed to initialize frame buffer object');
      return;
    }
    gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    // Set the clear color and enable the depth test
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    const viewProjMatrixFromLight = new Matrix4(); // Prepare a view projection matrix for generating a shadow map
    viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
    viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    const viewProjMatrix = new Matrix4(); // Prepare a view projection matrix for regular drawing
    viewProjMatrix.setPerspective(45, el.width / el.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let currentAngle = 0.0; // Current rotation angle (degrees)
    const mvpMatrixFromLight_t = new Matrix4(); // A model view projection matrix from light source (for triangle)
    const mvpMatrixFromLight_p = new Matrix4(); // A model view projection matrix from light source (for plane)

    const tick = () => {
      currentAngle = animate(currentAngle);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // Change the drawing destination to FBO
      gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT); // Set view port for FBO
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

      gl.useProgram(shadowProgram); // Set shaders for generating a shadow map
      drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight);
      mvpMatrixFromLight_t.set(g_mvpMatrix); // Used later
      drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
      mvpMatrixFromLight_p.set(g_mvpMatrix); // Used later

      gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Change the drawing destination to color buffer
      gl.viewport(0, 0, el.width, el.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffer

      gl.useProgram(normalProgram); // Set the shader for regular drawing
      gl.uniform1i(normalProgram.u_ShadowMap, 0); // Pass 0 because gl.TEXTURE0 is enabledする
      // Draw the triangle and plane ( for regular drawing)
      gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
      drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);
      gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
      drawPlane(gl, normalProgram, plane, viewProjMatrix);

      timer = requestAnimationFrame(tick);
    };
    tick();
  };

  return <MyCanvas main={main} />;
};

export default ShadowMap;
