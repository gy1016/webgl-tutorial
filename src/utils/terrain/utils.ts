import { IWebGLCtx } from '@/hooks/useWebGL';
import Terrain from '.';
import Cuboid from './Cuboid';

export function readDemFile(result: string, terrain: Terrain) {
  let stringlines = result.split('\n');
  if (!stringlines || stringlines.length <= 0) {
    return false;
  }

  // 读取头信息
  let subline = stringlines[0].split('\t');
  if (subline.length != 6) {
    return false;
  }
  const col = parseInt(subline[4]); // 有多少行
  const row = parseInt(subline[5]); // 有多少列
  const verticeNum = col * row;
  if (verticeNum + 1 > stringlines.length) {
    return false;
  }
  terrain.setWH(col, row);

  // 读取点信息
  let ci = 0;
  terrain.verticesColors = new Float32Array(verticeNum * 6);
  for (let i = 1; i < stringlines.length; i++) {
    if (!stringlines[i]) {
      continue;
    }
    let subline = stringlines[i].split(',');
    if (subline.length != 9) {
      continue;
    }

    for (let j = 0; j < 6; j++) {
      terrain.verticesColors[ci] = parseFloat(subline[j]);
      ci++;
    }
  }

  if (ci !== verticeNum * 6) {
    return false;
  }

  // 包围盒
  let minX = terrain.verticesColors[0];
  let maxX = terrain.verticesColors[0];
  let minY = terrain.verticesColors[1];
  let maxY = terrain.verticesColors[1];
  let minZ = terrain.verticesColors[2];
  let maxZ = terrain.verticesColors[2];
  for (let i = 0; i < verticeNum; i++) {
    minX = Math.min(minX, terrain.verticesColors[i * 6]);
    maxX = Math.max(maxX, terrain.verticesColors[i * 6]);
    minY = Math.min(minY, terrain.verticesColors[i * 6 + 1]);
    maxY = Math.max(maxY, terrain.verticesColors[i * 6 + 1]);
    minZ = Math.min(minZ, terrain.verticesColors[i * 6 + 2]);
    maxZ = Math.max(maxZ, terrain.verticesColors[i * 6 + 2]);
  }

  terrain.cuboid = new Cuboid(minX, maxX, minY, maxY, minZ, maxZ);
  return true;
}

export function initVertexBuffers(gl: IWebGLCtx, terrain: Terrain) {
  //DEM的一个网格是由两个三角形组成的
  //      0------1            1
  //      |                   |
  //      |                   |
  //      col       col------col+1
  var col = terrain.col;
  var row = terrain.row;

  var indices = new Uint16Array((row - 1) * (col - 1) * 6);
  var ci = 0;
  for (var yi = 0; yi < row - 1; yi++) {
    for (var xi = 0; xi < col - 1; xi++) {
      indices[ci * 6] = yi * col + xi;
      indices[ci * 6 + 1] = (yi + 1) * col + xi;
      indices[ci * 6 + 2] = yi * col + xi + 1;
      indices[ci * 6 + 3] = (yi + 1) * col + xi;
      indices[ci * 6 + 4] = (yi + 1) * col + xi + 1;
      indices[ci * 6 + 5] = yi * col + xi + 1;
      ci++;
    }
  }

  var verticesColors = terrain.verticesColors;
  var FSIZE = verticesColors?.BYTES_PER_ELEMENT as number; //数组中每个元素的字节数

  // 创建缓冲区对象
  var vertexColorBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  //获取着色器中attribute变量a_Position的地址
  var a_Position = gl.getAttribLocation(<WebGLProgram>gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  //获取着色器中attribute变量a_Color的地址
  var a_Color = gl.getAttribLocation(<WebGLProgram>gl.program, 'a_Color');
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
