export interface IWebGLCtx extends WebGLRenderingContext {
  program: WebGLProgram;
}

export function useWebGL(canvasEl: HTMLCanvasElement, VSHADER_SOURCE: string, FSHADER_SOURCE: string) {
  const gl = canvasEl.getContext('webgl') as IWebGLCtx;
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { gl };
}

function initShaders(gl: IWebGLCtx, vshader: string, fshader: string) {
  const program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

export function createProgram(gl: IWebGLCtx, vshader: string, fshader: string) {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function loadShader(gl: IWebGLCtx, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function loadTexture(gl: IWebGLCtx, n: number, texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: any) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);

  gl.clearColor(0.8, 0.8, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0); // Draw the rectangle
}

/**
 * @param gl webgl上下文
 * @param data 存入缓冲区中的数据
 * @param num 每个顶点属性的组成量
 * @param type 数组中每个元素的数据类型
 * @param attribute 要获取顶点着色器中的哪个attribute变量
 * @returns ture | false
 */
function initArrayBuffer(gl: IWebGLCtx, data: Float32Array | Uint8Array, num: number, type: number, attribute: string) {
  const buffer = gl.createBuffer(); // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute letiable
  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute letiable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

export function initCircleVertexBuffers(gl: IWebGLCtx, sphereDiv: number) {
  const positions = [];
  const indices = [];
  const texPos = [];

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 这里为什么是小于等于呢?
  // 因为在一个圆中，要有一个点出现两次，这样才能重合
  // sin(0) = sin(180)
  for (let j = 0; j <= sphereDiv; j++) {
    // 角度从0 -> pi
    let zRad = (j * Math.PI) / sphereDiv;
    let r = Math.sin(zRad);
    let z = Math.cos(zRad);
    let v = j / sphereDiv;
    for (let i = 0; i <= sphereDiv; i++) {
      // 角度从 0 -> 2pi
      let xyRad = (i * 2 * Math.PI) / sphereDiv;
      let x = r * Math.sin(xyRad);
      let y = r * Math.cos(xyRad);

      positions.push(...[x, y, z]);

      let u = i / sphereDiv;
      texPos.push(...[u, v]);
    }
  }

  // 这里为什么是小于呢？
  // 因为在上面等于产生的点，实际上是位置相等，仅仅为了闭合
  for (let j = 0; j < sphereDiv; j++) {
    for (let i = 0; i < sphereDiv; i++) {
      // 第j圈的第i个点
      // 之所以sphereDiv + 1是因为有一列是重复的点（为了闭合的）
      let p1 = j * (sphereDiv + 1) + i;
      // p1下面的点，即第j+1圈的第i个点
      let p2 = p1 + (sphereDiv + 1);

      indices.push(...[p1, p2, p1 + 1]);
      indices.push(...[p2, p2 + 1, p1 + 1]);
    }
  }

  if (!initArrayBuffer(gl, new Float32Array(positions), 3, gl.FLOAT, 'a_Position')) return -1;
  // if (!initArrayBuffer(gl, new Float32Array(positions), 3, gl.FLOAT, 'a_Normal')) return [-1, -1];
  if (!initArrayBuffer(gl, new Float32Array(texPos), 2, gl.FLOAT, 'a_TexCoord')) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}

export function initVertexBuffers(
  gl: IWebGLCtx,
  vertices: Float32Array,
  n: number,
  size: number,
  stride: number,
  offset: number,
) {
  // Create a buffer object
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const FSIZE = vertices.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
  } else {
    gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, FSIZE * stride, 0);
    gl.enableVertexAttribArray(a_Position);
  }

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
  } else {
    gl.vertexAttribPointer(a_Color, size, gl.FLOAT, false, FSIZE * stride, FSIZE * offset);
    gl.enableVertexAttribArray(a_Color); // Enable the assignment of the buffer object
  }

  const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
  } else {
    gl.vertexAttribPointer(a_TexCoord, size, gl.FLOAT, false, FSIZE * stride, FSIZE * offset);
    gl.enableVertexAttribArray(a_TexCoord);
  }

  return n;
}

export function init3DVertexBuffers(
  gl: IWebGLCtx,
  vertices: Float32Array,
  colors: Float32Array,
  indices: Uint8Array,
  normals?: Float32Array,
) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) return -1;
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
  if (normals) initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

export function initTextures(gl: IWebGLCtx, n: number, src: string) {
  // Create a texture object
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  // Create the image object
  const image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  image.src = src;
  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };

  return true;
}

export function initCubeVertexBuffersNoColor(
  gl: IWebGLCtx,
  vertices: Float32Array,
  indices: Uint8Array,
  normals: Float32Array,
) {
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) return -1;

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return indices.length;
}

export function initEventHndlers(el: any, currentAngle: number[]) {
  let dragging = false;
  let lastX = -1;
  let lastY = -1;

  el.onmousedown = function (ev: any) {
    let x = ev.clientX;
    let y = ev.clientY;

    const rect = ev.target.getBoundingClientRect();

    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
  };

  el.onmouseup = function () {
    dragging = false;
  };

  el.onmousemove = function (ev: any) {
    let x = ev.clientX;
    let y = ev.clientY;
    if (dragging) {
      let factor = 100 / el.height;
      let dx = factor * (x - lastX);
      let dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90), -90);
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x;
    lastY = y;
  };
}

export function initCubeWithFace(gl: IWebGLCtx) {
    // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  let vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);

  let colors = new Float32Array([   // Colors
    0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v0-v1-v2-v3 front
    0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
    0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v0-v5-v6-v1 up
    0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v1-v6-v7-v2 left
    0.27, 0.58, 0.82,  0.27, 0.58, 0.82,  0.27, 0.58, 0.82,  0.27, 0.58, 0.82, // v7-v4-v3-v2 down
    0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
  ]);

  let faces = new Uint8Array([   // Faces
    1, 1, 1, 1,     // v0-v1-v2-v3 front
    2, 2, 2, 2,     // v0-v3-v4-v5 right
    3, 3, 3, 3,     // v0-v5-v6-v1 up
    4, 4, 4, 4,     // v1-v6-v7-v2 left
    5, 5, 5, 5,     // v7-v4-v3-v2 down
    6, 6, 6, 6,     // v4-v7-v6-v5 back
  ]);

  let indices = new Uint8Array([   // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Create a buffer object
  let indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  // Write vertex information to buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1; // Coordinates Information
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;      // Color Information
  if (!initArrayBuffer(gl, faces, 1, gl.UNSIGNED_BYTE, 'a_Face')) return -1;// Surface Information

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

export function initArrayBufferForLaterUse(gl: IWebGLCtx, data: Float32Array, num: number, type: number) {
  // Create a buffer object
  let buffer: Partial<WebGLBuffer & {num: number; type: number}> | null = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute letiable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

export function initElementArrayBufferForLaterUse(gl: IWebGLCtx, data: Uint8Array, type: number) {
  // Create a buffer object
  let buffer: Partial<WebGLBuffer & {num: number; type: number}> | null = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

export function initFramebufferObject(gl: IWebGLCtx, w?: number, h?: number) {
  let OFFSCREEN_WIDTH = w ? w : 256;
  let OFFSCREEN_HEIGHT = h ? h : 256;
  let framebuffer: any;
  let texture: any;
  let depthBuffer: any;

  let error = function () {
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (texture) gl.deleteTexture(texture);
    if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
    return null;
  }

  // Create a frame buffer object (FBO)
  framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    console.log('Failed to create frame buffer object');
    return error();
  }

  // Create a texture object and set its size and parameters
  texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log('Failed to create texture object');
    return error();
  }
  gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  framebuffer.texture = texture; // Store the texture object

  depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
  if (!depthBuffer) {
    console.log('Failed to create renderbuffer object');
    return error();
  }
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

  // Attach the texture and the renderbuffer object to the FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Check if FBO is configured correctly
  let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (gl.FRAMEBUFFER_COMPLETE !== e) {
    console.log('Frame buffer object is incomplete: ' + e.toString());
    return error();
  }

  // Unbind the buffer object
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return framebuffer;
}

export function initVertexBuffersForTriangle(gl: IWebGLCtx) {
  // Create a triangle
  //       v2
  //      / | 
  //     /  |
  //    /   |
  //  v0----v1

  // Vertex coordinates
  const vertices = new Float32Array([-0.8, 3.5, 0.0,  0.8, 3.5, 0.0,  0.0, 3.5, 1.8]);
  // Colors
  const colors = new Float32Array([1.0, 0.5, 0.0,  1.0, 0.5, 0.0,  1.0, 0.0, 0.0]);    
  // Indices of the vertices
  const indices = new Uint8Array([0, 1, 2]);

  const o: any = {}
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

export function initVertexBuffersForPlane(gl: IWebGLCtx) {
  // Create a plane
  //  v1------v0
  //  |        | 
  //  |        |
  //  |        |
  //  v2------v3

  // Vertex coordinates
  const vertices = new Float32Array([
    3.0, -1.7, 2.5,  -3.0, -1.7, 2.5,  -3.0, -1.7, -2.5,   3.0, -1.7, -2.5    // v0-v1-v2-v3
  ]);

  // Colors
  const colors = new Float32Array([
    1.0, 1.0, 1.0,    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,   1.0, 1.0, 1.0
  ]);

  // Indices of the vertices
  const indices = new Uint8Array([0, 1, 2,   0, 2, 3]);

  const o: any = {}
  // Write vertex information to buffer object
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) return null;

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

export function initAttributeVariable(gl: IWebGLCtx, a_attribute: number, buffer: any) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

const ANGLE_STEP = 20.0
let last = Date.now();  // Last time that this function was called
export function animate(angle: number) {
  let now = Date.now(); // Calculate the elapsed time
  let elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}
