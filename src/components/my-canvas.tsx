import React, { useLayoutEffect, useRef, useEffect } from 'react';

interface IMyCanvas {
  main: (canvasEle: HTMLCanvasElement) => void;
  msg?: string;
}

const MyCanvas = (props: IMyCanvas) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const webgl = useRef<HTMLCanvasElement>(null);
  const { main, msg } = props;

  const draw = () => {
    if (webgl.current && parentRef.current) {
      webgl.current.width = parentRef.current.clientWidth;
      webgl.current.height = parentRef.current.clientHeight;
    }
    main(webgl.current as HTMLCanvasElement);
  };

  useEffect(() => {
    window.addEventListener('resize', draw);
    return () => {
      window.removeEventListener('resize', draw);
    };
  }, []);

  useLayoutEffect(() => {
    draw();
  }, []);

  return (
    <div id="my-canvas-container" style={{ width: '100%', height: '100%' }} ref={parentRef}>
      {msg ? (
        <div id="tip-msg" style={{ position: 'absolute', top: '2rem', right: '2rem', color: '#fff' }}>
          {msg}
        </div>
      ) : (
        ''
      )}
      <canvas id="webgl" ref={webgl}>
        Please use a browser that supports canvas
      </canvas>
    </div>
  );
};

export default MyCanvas;
