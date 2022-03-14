import { ReactNode, createElement } from 'react';
import ColoredPoints from '@/views/colored-points';
import HelloTriangle from '@/views/hello-triangle';
import TexturedQuad from '@/views/textured-quad';
import LookAtTriangle from '@/views/look-at-triangle';
import PerspectiveMvp from '@/views/perspective-mvp';
import DepthBuffer from '@/views/depth-buffer';
import PolygonOffset from '@/views/polygon-offset';
import ColoredCube from '@/views/colored-cube';
import PointLightedCube from '@/views/point-lighted-cube';

interface IViewProps {
  id: number; // 视图ID
  path: string; // 对应路径
  element: ReactNode; // 对应组件
  default?: boolean; // 是否为默认视图
}

const ViewArr: Array<IViewProps> = [
  {
    id: 1,
    path: 'colored-points',
    element: createElement(ColoredPoints),
    default: true,
  },
  {
    id: 2,
    path: 'hello-triangle',
    element: createElement(HelloTriangle),
    default: true,
  },
  {
    id: 3,
    path: 'textured-quad',
    element: createElement(TexturedQuad),
    default: true,
  },
  {
    id: 4,
    path: 'look-at-triangle',
    element: createElement(LookAtTriangle),
    default: true,
  },
  {
    id: 5,
    path: 'perspective-mvp',
    element: createElement(PerspectiveMvp),
    default: true,
  },
  {
    id: 6,
    path: 'depth-buffer',
    element: createElement(DepthBuffer),
    default: true,
  },
  {
    id: 7,
    path: 'polygon-offset',
    element: createElement(PolygonOffset),
    default: true,
  },
  {
    id: 8,
    path: 'colored-cube',
    element: createElement(ColoredCube),
    default: true,
  },
  {
    id: 9,
    path: 'point-lighted-cube',
    element: createElement(PointLightedCube),
    default: true,
  },
];

export default ViewArr;
