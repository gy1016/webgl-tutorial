import React, { useEffect } from 'react';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-terrain-show.glsl';
import fShader from '@/shader/f-terrain-show.glsl';
import { useWebGL, IWebGLCtx, initEventHndlers } from '@/hooks/useWebGL';
import Terrain from '@/utils/terrain';
import Cuboid from '@/utils/terrain/Cuboid';
import Matrix4 from '@/utils/martix';
import tex from '@/assets/tex.jpg';

let timer: any = null;
let currentAngle = [0.0, 0.0]; // 绕X轴Y轴的旋转角度 ([x-axis, y-axis])
let curScale = [1.0]; // 当前的缩放比例
let initTexSuccess = false; // 纹理图像是否加载完成

function setMVPMatrix(gl: IWebGLCtx, canvas: any, cuboid: Cuboid) {
  // Get the storage location of u_MvpMatrix
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  // 模型矩阵
  let modelMatrix = new Matrix4();
  modelMatrix.scale(curScale[0], curScale[0], curScale[0]);
  modelMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
  modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
  modelMatrix.translate(-cuboid.CenterX(), -cuboid.CenterY(), -cuboid.CenterZ());

  // 投影矩阵
  let fovy = 60;
  let projMatrix = new Matrix4();
  projMatrix.setPerspective(fovy, canvas.width / canvas.height, 1, 10000);

  // 计算lookAt()函数初始视点的高度
  let angle = ((fovy / 2) * Math.PI) / 180.0;
  let eyeHight = (cuboid.LengthY() * 1.2) / 2.0 / angle;

  // 视图矩阵
  let viewMatrix = new Matrix4(); // View matrix
  viewMatrix.lookAt(0, 0, eyeHight, 0, 0, 0, 0, 1, 0);

  // MVP矩阵
  let mvpMatrix = new Matrix4();
  mvpMatrix.set(projMatrix)!.multiply(viewMatrix).multiply(modelMatrix);

  // 将MVP矩阵传输到着色器的uniform变量u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
}

function onDraw(gl: IWebGLCtx, el: HTMLCanvasElement, terrain: Terrain) {
  let n = initVertexBuffers(gl, terrain);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // 设置纹理
  if (!initTextures(gl, terrain)) {
    console.log('Failed to intialize the texture.');
    return;
  }

  const tick = () => {
    if (initTexSuccess) {
      setMVPMatrix(gl, el, terrain.cuboid as Cuboid);
      // 清空颜色和深度缓冲区
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 绘制矩形体
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    }
    timer = requestAnimationFrame(tick);
  };

  tick();
}

function initVertexBuffers(gl: IWebGLCtx, terrain: Terrain) {
  // DEM的一个网格是由两个三角形组成的
  //      0------1            1
  //      |                   |
  //      |                   |
  //      col       col------col+1
  let col = terrain.col;
  let row = terrain.row;

  let indices = new Uint16Array((row - 1) * (col - 1) * 6);
  let ci = 0;
  for (let yi = 0; yi < row - 1; yi++) {
    // for (let yi = 0; yi < 10; yi++) {
    for (let xi = 0; xi < col - 1; xi++) {
      indices[ci * 6] = yi * col + xi;
      indices[ci * 6 + 1] = (yi + 1) * col + xi;
      indices[ci * 6 + 2] = yi * col + xi + 1;
      indices[ci * 6 + 3] = (yi + 1) * col + xi;
      indices[ci * 6 + 4] = (yi + 1) * col + xi + 1;
      indices[ci * 6 + 5] = yi * col + xi + 1;
      ci++;
    }
  }

  let verticesColors = terrain.verticesColors;
  let FSIZE = verticesColors!.BYTES_PER_ELEMENT; // 数组中每个元素的字节数

  // 创建缓冲区对象
  let vertexColorBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // 获取着色器中attribute变量a_Position的地址
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 获取着色器中attribute变量a_Color的地址
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // 将缓冲区对象分配给a_Color变量
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  // 连接a_Color变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Color);

  // 将顶点索引写入到缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initTextures(gl: IWebGLCtx, terrain: Terrain) {
  // 传递X方向和Y方向上的范围到着色器
  let u_RangeX = gl.getUniformLocation(gl.program, 'u_RangeX');
  let u_RangeY = gl.getUniformLocation(gl.program, 'u_RangeY');
  if (!u_RangeX || !u_RangeY) {
    console.log('Failed to get the storage location of u_RangeX or u_RangeY');
    return;
  }
  gl.uniform2f(u_RangeX, terrain.cuboid!.minX, terrain.cuboid!.maxX);
  gl.uniform2f(u_RangeY, terrain.cuboid!.minY, terrain.cuboid!.maxY);

  // 创建一个image对象
  let image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // 图像加载的响应函数
  image.onload = function () {
    if (loadTexture(gl, image)) {
      initTexSuccess = true;
    }
  };

  // 浏览器开始加载图像
  image.src = tex;

  return true;
}

function loadTexture(gl: IWebGLCtx, image: HTMLImageElement) {
  // 创建纹理对象
  let texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号单元纹理传递给着色器中的取样器变量
  let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  gl.uniform1i(u_Sampler, 0);

  return true;
}

const TerrainShow = () => {
  useEffect(() => {
    return () => window.cancelAnimationFrame(timer);
  }, []);

  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);
    // 指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 开启深度测试
    gl.enable(gl.DEPTH_TEST);

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initEventHndlers(el, currentAngle, curScale);

    const worker = new Worker(new URL('./terrain.js', import.meta.url));
    worker.onmessage = function (e) {
      const terrain = e.data.terrain;
      const { minX, maxX, minY, maxY, minZ, maxZ } = terrain.cuboid;
      terrain.cuboid = new Cuboid(minX, maxX, minY, maxY, minZ, maxZ);
      if (!terrain) {
        console.log('文件格式有误，不能读取该文件！');
      }
      onDraw(gl, el, terrain);
    };
  };

  return <MyCanvas main={main} msg="加载ing(即使文件解析放到webworker中, 任然很慢)..." />;
};

export default TerrainShow;
