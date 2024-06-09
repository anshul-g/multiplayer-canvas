'use client';

import React, { useRef, useState, useEffect } from 'react';
import Toolbar from './(toolBar)/page';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorCoordinates, setCursorCoordinates] = useState({
    prevCursorX: 0,
    prevCursorY: 0,
    currCursorX: 0,
    currCursorY: 0,
  });
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 400,
    height: 400,
  });

  const [toolType, setToolType] = useState<Tool>("line")
  const [isErasing, setIsErasing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawLine = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: { strokeColor?: string; strokeWidth?: number }
  ): void => {
    if (!context) return;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = options?.strokeColor || 'black';
    context.lineWidth = options?.strokeWidth || 4;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };

  const erase = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    options?: {
      strokeColor?: string;
      strokeWidth?: number;
      eraserRadius?: number;
    }
  ) => {
    if (!context) return;
    (context.fillStyle = 'white'), context.beginPath();
    context.arc(x1, y1, 50, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  };

  const drawRect = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    ...args: any
  ) => {
    if (!context) return;
    context.beginPath();
    context.rect(x1, y1, x2 - x1, y2 - y1);
  };

  useEffect(() => {
    let canvasWidth = 400;
    let canvasHeight = 400;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;
  }, []);

  const handleTouchStart = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);
  };

  const handleTouchMove = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
  };

  const handleTouchEnd = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(false);
  };

  const handleMouseDown = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): void => {
    setCursorCoordinates((prevState) => ({
      prevCursorX: prevState.currCursorX,
      prevCursorY: prevState.currCursorY,
      currCursorX: event.clientX,
      currCursorY: event.clientY,
    }));

    if (!isDrawing) return;

    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;

    let color = 'black';
    if (!isErasing)
      drawLine(
        context,
        cursorCoordinates.prevCursorX,
        cursorCoordinates.prevCursorY,
        cursorCoordinates.currCursorX,
        cursorCoordinates.currCursorY,
        { strokeColor: color, strokeWidth: 8 }
      );
    else
      erase(
        context,
        cursorCoordinates.currCursorX,
        cursorCoordinates.currCursorY
      );
  };

  const handleMouseUp = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(false);
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
      <Toolbar toolTypeHandler={setToolType}></Toolbar>
    </div>
  );
}
