/* eslint-disable max-params */
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

function createProgram(gl: IWebGLCtx, vshader: string, fshader: string) {
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

  console.log('hualehuale');
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
function initArrayBuffer(gl: IWebGLCtx, data: Float32Array, num: number, type: number, attribute: string) {
  const buffer = gl.createBuffer(); // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

export function initCircleVertexBuffers(gl: IWebGLCtx, sphereDiv: number) {
  const positions = [];
  const indices = [];
  const texPos = [];

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

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

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
