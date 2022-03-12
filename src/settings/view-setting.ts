import { ReactNode, createElement } from 'react';
import ColoredPoints from '@/views/colored-points';
import HelloTriangle from '@/views/hello-triangle';

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
];

export default ViewArr;
