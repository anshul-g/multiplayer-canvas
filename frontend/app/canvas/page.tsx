'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });
  const [isDrawing, setIsDrawing] = useState(false);

  const drawLine = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): void => {
    context.beginPath(); // Begin a new path
    context.moveTo(x1, y1); // Move the pen to the starting point
    context.lineTo(x2, y2); // Draw a line to the end point
    context.stroke(); // Render the line
  };

  useEffect(() => {
    let canvasWidth = document.body.clientWidth - 16;
    let canvasHeight = document.body.clientHeight - 16;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;
  }, []);

  const resizeCanvas = (): void => {};

  const handleTouchStart = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);
    console.log('touch start');
  };

  const handleTouchMove = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    console.log('touch move');
  };

  const handleTouchEnd = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(false);
    console.log('touch end');
  };

  const handleMouseDown = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);
    console.log('touch start');
  };

  const handleMouseMove = (): void => {
    if(!isDrawing) return;
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    
    console.log('touch move');
  };

  const handleMouseUp = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(false);
    console.log('touch end');
  };

  return (
    <div>
      <canvas
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
        style={{ border: '1px solid black', margin: '8px' }}
      />
    </div>
  );
}
