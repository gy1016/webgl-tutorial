import React from 'react';
import RouterArr from '@/settings/router-setting';
import './index.less';
import { Link } from 'react-router-dom';

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

const NavigationBar = () => {
  let showArr = RouterArr;
  if (mode === 'prod') {
    showArr = showArr.filter((s) => s.mode === mode);
  }

  return (
    <div id="navigation-bar">
      {showArr.map((r) => {
        return (
          <div key={r.id} className="route-item">
            <Link to={r.path}>{r.label}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default NavigationBar;
