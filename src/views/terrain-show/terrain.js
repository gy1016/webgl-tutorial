import Terrain from '@/utils/terrain';
import Cuboid from '@/utils/terrain/Cuboid';

getDem('http://121.199.160.202/json/DEM.dem', (dem) => {
  const terrain = new Terrain();
  if (readDemFile(dem, terrain)) {
    self.postMessage({ ready: true, terrain });
  }
});

function getDem(url, cbk) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.setRequestHeader('Accept', 'application/text');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
      cbk(xhr.responseText);
    }
  };
  xhr.send();
}

function readDemFile(result, terrain) {
  const stringlines = result.split('\n');
  if (!stringlines || stringlines.length <= 0) {
    return false;
  }

  let subline = stringlines[0].split('\t');
  if (subline.length !== 6) {
    return false;
  }
  let col = parseInt(subline[4], 10); // DEM宽
  let row = parseInt(subline[5], 10); // DEM高
  let verticeNum = col * row;
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
    if (subline.length !== 9) {
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

  // console.log('terrain.cuboid:', terrain.cuboid);
  return true;
}
