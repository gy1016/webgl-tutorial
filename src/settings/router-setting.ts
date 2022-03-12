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
];

export default RouterArr;
