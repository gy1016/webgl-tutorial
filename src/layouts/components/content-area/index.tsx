import React from 'react';
import ViewArr from '@/settings/view-setting';
import { Navigate, Route, Routes } from 'react-router-dom';
import './index.less';

const ContentArea = () => {
  const defaultView = ViewArr.find((v) => v.default)?.path;

  return (
    <div id="content-area">
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultView}`} />} />
        {ViewArr.map((v) => {
          return <Route key={v.id} path={v.path} element={v.element} />;
        })}
      </Routes>
    </div>
  );
};

export default ContentArea;
