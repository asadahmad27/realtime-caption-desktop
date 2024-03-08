import React from 'react';
import { Tooltip as AntdTooltip } from 'antd';
import './Tooltip.css';

interface TooltipProps {
  title: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ title }) => {
  return title && title.length > 40 ? (
    <AntdTooltip
      title={title}
      overlayClassName="chapterTitleInfo"
      placement="right"
    >
      <span>{title.slice(0, 40)}...</span>
    </AntdTooltip>
  ) : (
    <span>{title}</span>
  );
};

export default CustomTooltip;
