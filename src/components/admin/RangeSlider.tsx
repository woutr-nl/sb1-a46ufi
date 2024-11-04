import React, { useCallback, useEffect, useRef, useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max]
  );

  const getValueFromPosition = useCallback(
    (position: number) => {
      const percentage = position;
      const rawValue = (percentage * (max - min)) / 100 + min;
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(Math.max(steppedValue, min), max);
    },
    [max, min, step]
  );

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging === null || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      const newValue = getValueFromPosition(position);

      const newValues: [number, number] = [...value];
      newValues[isDragging] = newValue;

      // Ensure values don't cross each other
      if (isDragging === 0 && newValue < value[1]) {
        onChange([newValue, value[1]]);
      } else if (isDragging === 1 && newValue > value[0]) {
        onChange([value[0], newValue]);
      }
    },
    [isDragging, value, onChange, getValueFromPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative w-full h-6 mt-2">
      <div
        ref={sliderRef}
        className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full top-1/2 transform -translate-y-1/2"
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
          }}
        />
      </div>
      {[0, 1].map((index) => (
        <div
          key={index}
          className="absolute w-4 h-4 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer"
          style={{
            left: `${getPercentage(value[index])}%`,
            marginLeft: '-0.5rem',
            zIndex: isDragging === index ? 2 : 1,
          }}
          onMouseDown={handleMouseDown(index)}
        />
      ))}
      <div className="absolute w-full flex justify-between mt-4 text-xs text-gray-500">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
};