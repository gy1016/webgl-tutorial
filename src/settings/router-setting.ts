interface IRouterProps {
  id: number; // 路由ID
  path: string; // 路由地址
  label: string; // 路由名称
  seniorId?: number; // 父级路由ID
  children?: Array<IRouterProps>[]; // 子级路由
}

const RouterArr: Array<IRouterProps> = [
  {
    id: 1,
    label: 'colored-points',
    path: 'colored-points',
  },
  {
    id: 2,
    label: 'hello-triangle',
    path: 'hello-triangle',
  },
  {
    id: 3,
    label: 'textured-quad',
    path: 'textured-quad',
  },
  {
    id: 4,
    label: 'look-at-triangle',
    path: 'look-at-triangle',
  },
  {
    id: 5,
    label: 'perspective-mvp',
    path: 'perspective-mvp',
  },
  {
    id: 6,
    label: 'depth-buffer',
    path: 'depth-buffer',
  },
  {
    id: 7,
    label: 'polygon-offset',
    path: 'polygon-offset',
  },
  {
    id: 8,
    label: 'colored-cube',
    path: 'colored-cube',
  },
  {
    id: 9,
    label: 'point-lighted-cube',
    path: 'point-lighted-cube',
  },
  {
    id: 10,
    label: 'lighted-sphere',
    path: 'lighted-sphere',
  },
  {
    id: 11,
    label: 'multi-joint',
    path: 'multi-joint',
  },
  {
    id: 12,
    label: 'pick-face',
    path: 'pick-face',
  },
  {
    id: 13,
    label: 'fog',
    path: 'fog',
  },
  {
    id: 14,
    label: 'rounded-points',
    path: 'rounded-points',
  },
  {
    id: 15,
    label: 'alpha-blending',
    path: 'alpha-blending',
  },
  {
    id: 99,
    label: 'test',
    path: 'test',
  },
];

export default RouterArr;
