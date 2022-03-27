import React from 'react';
import MyCanvas from '@/components/my-canvas';
import Loading from '@/components/loading';
import vShader from '@/shader/v-terrain-show.glsl';
import fShader from '@/shader/f-terrain-show.glsl';
import { useWebGL } from '@/hooks/useWebGL';

getDem('/json/places.json', (dem: any) => {
  console.log(dem);
  postMessage({ ready: true });
});

function getDem(url: string, cbk: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
      cbk(xhr.response);
    }
  };
  xhr.send();
}

const worker = new Worker(new URL('./terrain.js', import.meta.url));
worker.onmessage = function (e) {
  console.log(e);
};

const TerrainShow = () => {
  const main = (el: HTMLCanvasElement) => {
    const { gl } = useWebGL(el, vShader, fShader);
    // 指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 开启深度测试
    gl.enable(gl.DEPTH_TEST);

    // 清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    console.log('haha');
  };
  return <MyCanvas main={main} />;
};

export default TerrainShow;
