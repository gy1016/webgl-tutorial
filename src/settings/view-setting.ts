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
import LightedSphere from '@/views/lighted-sphere';
import MultiJoint from '@/views/multijoint-model';
import PickFace from '@/views/pick-face';
import Fog from '@/views/fog';
import RoundedPoints from '@/views/rounded-points';
import AlphaBlending from '@/views/alpha-blending';
import ProgramObject from '@/views/program-object';
import Test from '@/views/test';

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
    default: false,
  },
  {
    id: 3,
    path: 'textured-quad',
    element: createElement(TexturedQuad),
    default: false,
  },
  {
    id: 4,
    path: 'look-at-triangle',
    element: createElement(LookAtTriangle),
    default: false,
  },
  {
    id: 5,
    path: 'perspective-mvp',
    element: createElement(PerspectiveMvp),
    default: false,
  },
  {
    id: 6,
    path: 'depth-buffer',
    element: createElement(DepthBuffer),
    default: false,
  },
  {
    id: 7,
    path: 'polygon-offset',
    element: createElement(PolygonOffset),
    default: false,
  },
  {
    id: 8,
    path: 'colored-cube',
    element: createElement(ColoredCube),
    default: false,
  },
  {
    id: 9,
    path: 'point-lighted-cube',
    element: createElement(PointLightedCube),
    default: false,
  },
  {
    id: 10,
    path: 'lighted-sphere',
    element: createElement(LightedSphere),
    default: false,
  },
  {
    id: 11,
    path: 'multi-joint',
    element: createElement(MultiJoint),
    default: false,
  },
  {
    id: 12,
    path: 'pick-face',
    element: createElement(PickFace),
    default: false,
  },
  {
    id: 13,
    path: 'fog',
    element: createElement(Fog),
    default: false,
  },
  {
    id: 14,
    path: 'rounded-points',
    element: createElement(RoundedPoints),
    default: false,
  },
  {
    id: 15,
    path: 'alpha-blending',
    element: createElement(AlphaBlending),
    default: false,
  },
  {
    id: 15,
    path: 'program-object',
    element: createElement(ProgramObject),
    default: false,
  },
  {
    id: 99,
    path: 'test',
    element: createElement(Test),
    default: false,
  },
];

export default ViewArr;
