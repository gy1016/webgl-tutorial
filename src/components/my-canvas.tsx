import React, { useLayoutEffect, useRef } from 'react';

interface IMyCanvas {
  main: (canvasEle: HTMLCanvasElement) => void;
}

const MyCanvas = (props: IMyCanvas) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const webgl = useRef<HTMLCanvasElement>(null);
  const { main } = props;

  useLayoutEffect(() => {
    if (webgl.current && parentRef.current) {
      webgl.current.width = parentRef.current.clientWidth;
      webgl.current.height = parentRef.current.clientHeight;
    }
    main(webgl.current as HTMLCanvasElement);
  }, []);

  return (
    <div id="colored-points" style={{ width: '100%', height: '100%' }} ref={parentRef}>
      <canvas id="webgl" ref={webgl}>
        Please use a browser that supports canvas
      </canvas>
    </div>
  );
};

export default MyCanvas;
