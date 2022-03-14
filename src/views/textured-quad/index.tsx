import React from 'react';
import { useWebGL, initVertexBuffers, initTextures } from '@/hooks/useWebGL';
import djfcz from '@/assets/djfcz.png';
import sky from '@/assets/sky.jpg';
import MyCanvas from '@/components/my-canvas';
import vShader from '@/shader/v-textured-quad.glsl';
import fShader from '@/shader/f-textured-quad.glsl';

/**
 * 1. 准备好映射到几何图形上的纹理图像
 * 2. 为几何图形配置纹理映射方式
 * 3. 加载纹理图像，对其进行一些配置，已在webgl中使用它
 * 4. 在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元
 */
const TexturedQuad = () => {
  const main = (canvasEle: HTMLCanvasElement) => {
    const { gl }: any = useWebGL(canvasEle, vShader, fShader);
    const vertices = new Float32Array([
      // Vertex coordinates, texture coordinate
      -0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.5, -0.5, 1.0, 0.0,
    ]);
    const n = initVertexBuffers(gl, vertices, 4, 2, 4, 2);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
    if (!initTextures(gl, 4, djfcz)) {
      console.log('Failed to intialize the texture.');
      return;
    }
  };

  return <MyCanvas main={main} />;
};

export default TexturedQuad;
