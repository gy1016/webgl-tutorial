interface IRouterProps {
  id: number; // 路由ID
  path: string; // 路由地址
  label: string; // 路由名称
  seniorId?: number; // 父级路由ID
  children?: Array<IRouterProps>[]; // 子级路由
  mode: 'dev' | 'prod';
}

const RouterArr: Array<IRouterProps> = [
  {
    id: 1,
    label: '颜色点',
    path: 'colored-points',
    mode: 'dev',
  },
  {
    id: 2,
    label: '三角形',
    path: 'hello-triangle',
    mode: 'dev',
  },
  {
    id: 3,
    label: '二维贴图',
    path: 'textured-quad',
    mode: 'dev',
  },
  {
    id: 4,
    label: '视点',
    path: 'look-at-triangle',
    mode: 'dev',
  },
  {
    id: 5,
    label: '透视投影',
    path: 'perspective-mvp',
    mode: 'prod',
  },
  {
    id: 6,
    label: '深度缓冲',
    path: 'depth-buffer',
    mode: 'prod',
  },
  {
    id: 7,
    label: '多边形偏移',
    path: 'polygon-offset',
    mode: 'prod',
  },
  {
    id: 8,
    label: '颜色正方体',
    path: 'colored-cube',
    mode: 'prod',
  },
  {
    id: 9,
    label: '点光源',
    path: 'point-lighted-cube',
    mode: 'prod',
  },
  {
    id: 10,
    label: '球贴图',
    path: 'lighted-sphere',
    mode: 'prod',
  },
  {
    id: 11,
    label: '层次模型',
    path: 'multi-joint',
    mode: 'prod',
  },
  {
    id: 12,
    label: '点选面',
    path: 'pick-face',
    mode: 'prod',
  },
  {
    id: 13,
    label: '雾化',
    path: 'fog',
    mode: 'prod',
  },
  {
    id: 14,
    label: '画圆点',
    path: 'rounded-points',
    mode: 'prod',
  },
  {
    id: 15,
    label: 'α混合',
    path: 'alpha-blending',
    mode: 'prod',
  },
  {
    id: 16,
    label: '多个程序',
    path: 'program-object',
    mode: 'prod',
  },
  {
    id: 17,
    label: '帧缓冲',
    path: 'frame-buffer',
    mode: 'prod',
  },
  {
    id: 18,
    label: '阴影映射',
    path: 'shadow-map',
    mode: 'prod',
  },
  {
    id: 19,
    label: '地形展示',
    path: 'terrain-show',
    mode: 'prod',
  },
  {
    id: 99,
    label: 'test',
    path: 'test',
    mode: 'dev',
  },
];

export default RouterArr;
