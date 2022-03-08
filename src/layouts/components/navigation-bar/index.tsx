import React from 'react';
import RouterArr from '@/settings/router-setting';
import './index.less';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <div id="navigation-bar">
      {RouterArr.map((r) => {
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
