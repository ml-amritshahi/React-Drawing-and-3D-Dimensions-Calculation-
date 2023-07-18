import React, { useRef, useEffect } from 'react';

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
  }, []);

  const getOffset = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    return { offsetX, offsetY };
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = getOffset(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = getOffset(e);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const handleMouseUp = () => {
    canvasRef.current.removeEventListener('mousemove', handleMouseMove);
    canvasRef.current.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <canvas
    
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      width={500}
      height={500}
      style={{border: '4px solid black'}}
      
    />
  );
};

export default DrawingBoard;
