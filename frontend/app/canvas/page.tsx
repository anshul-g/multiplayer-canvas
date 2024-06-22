'use client';

import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './(toolBar)/page';
import {
  renderRect,
  renderCircle,
  drawLine,
  areCollinearPoints,
} from '../canvas/render.utils';
import io, { Socket } from 'socket.io-client';

export default function Home() {
  const [socketManager, setSocketManager] = useState(() =>
    io('http://localhost:5000/', { transports: ['websocket'] })
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorCoordinates, setCursorCoordinates] = useState({
    prevCursorX: 0,
    prevCursorY: 0,
    currCursorX: 0,
    currCursorY: 0,
  });

  const [startCoordinates, setStartCoordinates] = useState({
    startX: 0,
    startY: 0,
  });
  const [toolType, setToolType] = useState<Tool>('line');
  const [isDrawing, setIsDrawing] = useState(false);

  const [elements, setElements] = useState<any[]>([]);
  const [lineElement, setLineElement] = useState<any>({
    type: 'line',
    coordinates: [],
  });
  
  useEffect(() => {
    socketManager.on('connection', (socket) => {
      socket.broadcast.emit(socket.id);
    });
  }, []);
  
  useEffect(() => {
    socketManager.on('recieveStateChange', (el) => {
      setElements(el)
      const context = canvasRef?.current?.getContext('2d');
      if(!context) return;
      redrawFrame(context, el,  true)
    }) 
  }, [])
  
  const redrawFrame = (context: CanvasRenderingContext2D, el: any, clearCanvas = false) => {
    if(!elements.length && !el.length) return;
    if(toolType === 'rect' || toolType === 'circle' || clearCanvas){
      context.clearRect(
        0,
        0,
        canvasRef?.current?.width || 0,
        canvasRef?.current?.height || 0
      );
    }

      drawExistingLines(context, el);
      const x = el?.length ? el : elements

      x.forEach((element: any) => {
        switch (element.type as Tool) {
          case 'circle':
            renderCircle(
              context,
              element.x1,
              element.y1,
              element.x2,
              element.y2
            );
            break;
          case 'rect':
            renderRect(context, element.x1, element.y1, element.x2, element.y2);
            break;

          default:
            break;
        }
      });
  };

  const drawExistingLines = (context: CanvasRenderingContext2D, el: any) => {
    if (!context) return;
    context.save();
    context.beginPath();
    context.lineCap = 'round';
    const x = el?.length ? el : elements
    x
      .filter((ele: any) => ele.type === 'line')
      ?.forEach((element: any) => {
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 8;
        for (let i = 0; i < element.coordinates.length; i++) {
          context.moveTo(
            element.coordinates?.[i]?.[0],
            element.coordinates?.[i]?.[1]
          );
          context.lineTo(
            element.coordinates?.[i + 1]?.[0],
            element.coordinates?.[i + 1]?.[1]
          );
        }
      });
    context.stroke();
    context.restore();
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(true);

    if (toolType !== 'eraser') {
      setStartCoordinates({
        startX: event.clientX,
        startY: event.clientY,
      });
    }
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
    const lineElCoordinatesLength = lineElement.coordinates?.length;

    redrawFrame(context, elements);

    switch (toolType) {
      case 'circle':
        renderCircle(
          context,
          startCoordinates.startX,
          startCoordinates.startY,
          cursorCoordinates.currCursorX,
          cursorCoordinates.currCursorY
        );
        break;
      case 'rect':
        renderRect(
          context,
          startCoordinates.startX,
          startCoordinates.startY,
          cursorCoordinates.currCursorX,
          cursorCoordinates.currCursorY
        );
        break;

      case 'line':
        drawLine(
          context,
          cursorCoordinates.prevCursorX,
          cursorCoordinates.prevCursorY,
          cursorCoordinates.currCursorX,
          cursorCoordinates.currCursorY,
          { strokeColor: 'black', strokeWidth: 8 }
        );
        if (
          !areCollinearPoints(
            [cursorCoordinates.currCursorX, cursorCoordinates.currCursorY],
            [cursorCoordinates.prevCursorX, cursorCoordinates.prevCursorY],
            lineElement?.coordinates?.[lineElCoordinatesLength - 1]
          )
        )
          setLineElement((prev: any) => {
            return {
              type: toolType,
              coordinates: [
                ...prev?.coordinates,
                [event.clientX, event.clientY],
              ],
            };
          });

        break;
    }
  };

  const handleMouseUp = (): void => {
    const context = canvasRef?.current?.getContext('2d');
    if (!context) return;
    setIsDrawing(false);

    // store elements in the state
    if (toolType !== 'eraser' && toolType !== 'line') {
      setElements(prev => [
        ...prev,
        {
          type: toolType,
          x1: startCoordinates.startX,
          y1: startCoordinates.startY,
          x2: cursorCoordinates.currCursorX,
          y2: cursorCoordinates.currCursorY,
        },
      ]);
    } else if (toolType === 'line') {
      setElements(prev => [...prev, lineElement]);
      setLineElement({ type: toolType, coordinates: [] });
    }

    socketManager.emit("onStateChange", elements);
  };

  return (
    <div>
      <canvas
        width={document.body.clientWidth - 16}
        height={document.body.clientHeight - 16}
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
