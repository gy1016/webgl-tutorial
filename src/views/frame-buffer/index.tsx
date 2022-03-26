import React from 'react';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-frame-buffer.glsl';
import fShader from '@/shader/f-frame-buffer.glsl';
import {
  useWebGL,
  initArrayBufferForLaterUse,
  initElementArrayBufferForLaterUse,
  IWebGLCtx,
  initFramebufferObject,
  animate,
} from '@/hooks/useWebGL';
import Matrix4 from '@/utils/martix';
import sky from '@/assets/sky.jpg';

function initVertexBuffersForCube(gl: IWebGLCtx) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  // Vertex coordinates
  let vertices = new Float32Array([
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0, // v0-v1-v2-v3 front
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0, // v0-v3-v4-v5 right
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0, // v0-v5-v6-v1 up
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0, // v1-v6-v7-v2 left
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0, // v7-v4-v3-v2 down
    1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0, // v4-v7-v6-v5 back
  ]);

  // Texture coordinates
  let texCoords = new Float32Array([
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0, // v0-v1-v2-v3 front
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0, // v0-v3-v4-v5 right
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0, // v0-v5-v6-v1 up
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0, // v1-v6-v7-v2 left
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0, // v7-v4-v3-v2 down
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0, // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  let indices = new Uint8Array([
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

  let o: any = {}; // Create the "Object" object to return multiple objects.

  // Write vertex information to buffer object
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initVertexBuffersForPlane(gl: IWebGLCtx) {
  // Create face
  //  v1------v0
  //  |        |
  //  |        |
  //  |        |
  //  v2------v3

  // Vertex coordinates
  let vertices = new Float32Array([
    1.0,
    1.0,
    0.0,
    -1.0,
    1.0,
    0.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    -1.0,
    0.0, // v0-v1-v2-v3
  ]);

  // Texture coordinates
  let texCoords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);

  // Indices of the vertices
  let indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

  let o: any = {}; // Create the "Object" object to return multiple objects.

  // Write vertex information to buffer object
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initTextures(gl: IWebGLCtx) {
  let texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create the Texture object');
    return null;
  }

  // Get storage location of u_Sampler
  let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return null;
  }

  let image = new Image(); // Create image object
  if (!image) {
    console.log('Failed to create the Image object');
    return null;
  }
  // Register the event handler to be called when image loading is completed
  image.onload = function () {
    // Write image data to texture object
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image Y coordinate
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // Pass the texure unit 0 to u_Sampler
    gl.uniform1i(u_Sampler, 0);

    gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the texture object
  };

  // Tell the browser to load an Image
  image.src = sky;

  return texture;
}

function draw(
  gl: IWebGLCtx,
  canvas: any,
  fbo: any,
  plane: any,
  cube: any,
  angle: any,
  texture: any,
  viewProjMatrix: any,
  viewProjMatrixFBO: any,
) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, 256, 256);

  gl.clearColor(0.2, 0.2, 0.4, 1.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

  drawTexturedCube(gl, gl.program, cube, angle, texture, viewProjMatrixFBO);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Change the drawing destination to color buffer
  gl.viewport(0, 0, canvas.width, canvas.height); // Set the size of viewport back to that of <canvas>

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color buffer

  drawTexturedPlane(gl, gl.program, plane, angle, fbo.texture, viewProjMatrix); // Draw the plane
}

// Coordinate transformation matrix
let g_modelMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();

function drawTexturedCube(gl: any, program: any, o: any, angle: any, texture: any, viewProjMatrix: any) {
  // Calculate a model matrix
  g_modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  drawTexturedObject(gl, program, o, texture);
}

function drawTexturedObject(gl: any, program: any, o: any, texture: any) {
  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer); // Texture coordinates

  // Bind the texture object to the target
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl: any, a_attribute: any, buffer: any) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function drawTexturedPlane(gl: any, program: any, o: any, angle: any, texture: any, viewProjMatrix: any) {
  // Calculate a model matrix
  g_modelMatrix.setTranslate(0, 0, 1);
  g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
  g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  drawTexturedObject(gl, program, o, texture);
}

const FrameBuffer = () => {
  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);

    let program: any = gl.program; // Get program object
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    if (program.a_Position < 0 || program.a_TexCoord < 0 || !program.u_MvpMatrix) {
      console.log('Failed to get the storage location of a_Position, a_TexCoord, u_MvpMatrix');
      return;
    }

    // Set the vertex information
    let cube = initVertexBuffersForCube(gl);
    let plane = initVertexBuffersForPlane(gl);
    if (!cube || !plane) {
      console.log('Failed to set the vertex information');
      return;
    }

    // Set texture
    let texture = initTextures(gl);
    if (!texture) {
      console.log('Failed to intialize the texture.');
      return;
    }

    // Initialize framebuffer object (FBO)
    let fbo = initFramebufferObject(gl);
    if (!fbo) {
      console.log('Failed to intialize the framebuffer object (FBO)');
      return;
    }

    // Enable depth test
    gl.enable(gl.DEPTH_TEST); //  gl.enable(gl.CULL_FACE);

    let viewProjMatrix = new Matrix4(); // Prepare view projection matrix for color buffer
    viewProjMatrix.setPerspective(30, el.width / el.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    let viewProjMatrixFBO = new Matrix4(); // Prepare view projection matrix for FBO
    viewProjMatrixFBO.setPerspective(30.0, 256 / 256, 1.0, 100.0);
    viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // Start drawing
    let currentAngle = 0.0; // Current rotation angle (degrees)
    let tick = function () {
      currentAngle = animate(currentAngle); // Update current rotation angle
      draw(gl, el, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);
      window.requestAnimationFrame(tick);
    };
    tick();
  };

  return <MyCanvas main={main} />;
};

export default FrameBuffer;
