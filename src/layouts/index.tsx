import React from 'react';
import NavigationBar from './components/navigation-bar';
import ContentArea from './components/content-area';
import './index.less';

const WebglTutorial = () => {
  return (
    <div id="webgl-tutorial">
      <NavigationBar />
      <ContentArea />
    </div>
  );
};

export default WebglTutorial;
