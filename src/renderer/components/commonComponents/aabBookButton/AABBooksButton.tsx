import React from 'react';
import { Button } from 'antd';
import './AABBooksButton.css';

export interface AABBooksButtonProps {
  label: any;
  [key: string]: any;
  color?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
  fontSize?: string;
}

const AABBooksButton: React.FC<AABBooksButtonProps> = ({
  label,
  buttonCategory,
  color,
  borderRadius,
  width,
  height,
  fontSize,
  ...restProps
}) => {
  return (
    <Button
      className="button"
      style={{
        color: color,
        borderRadius: borderRadius,
        width: width,
        height: height,
        fontSize: fontSize,
      }}
      {...restProps}
    >
      {label}
    </Button>
  );
};

export default AABBooksButton;
