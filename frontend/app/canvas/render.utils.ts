export const drawLine = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: { strokeColor?: string; strokeWidth?: number }
): void => {
  if (!context) return;
  context.save();
  context.lineCap = 'round';
  context.strokeStyle = options?.strokeColor || 'black';
  context.lineWidth = options?.strokeWidth || 4;

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.restore();
};
export const renderCircle = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  if (!context) return;
  const diameter = getDistance(x1, y1, x2, y2);
  const originX = x1 + (x2 - x1) / 2;
  const originY = y1 + (y2 - y1) / 2;
  context.beginPath();
  context.arc(originX, originY, diameter / 2, 0, 2 * Math.PI);
  context.stroke();
};

export const renderRect = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  if (!context) return;
  context.beginPath();
  context.strokeRect(x1, y1, x2 - x1, y2 - y1);
  context.closePath();
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2)) + Math.sqrt(Math.pow(y1 - y2, 2));
};

export const areCollinearPoints = ([x1,y1]: number[], [x2,y2]: number[], lineEl: number[]) => {
  if(!x1 || !x2 || !lineEl) return false;
  const slopeA = (lineEl[1]-y2)/(lineEl[0]-x2)
  const slopeB = (y2-y1)/(x2-x1)
  return slopeA === slopeB
}
