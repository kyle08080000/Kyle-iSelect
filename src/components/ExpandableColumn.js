import React, { useState, useEffect, useRef } from 'react';

const ExpandableColumn = ({ children, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const columnRef = useRef(null);

  const handleScroll = () => {
    if (columnRef.current) {
      const columnTop = columnRef.current.getBoundingClientRect().top;
      const triggerHeight = window.innerHeight / 2; // 触发点设定为窗口高度的一半
      if (columnTop <= triggerHeight) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 合并外部传入的 className 和内部 className
  const combinedClassName = `expandable-column ${className || ''}`.trim();

  return (
    <div 
      ref={columnRef} 
      className={combinedClassName}
      style={{ 
        maxHeight: isExpanded ? '1000px' : '0', // 设定一个最大高度，确保内容能完全展开
        overflow: 'hidden', 
        transition: 'max-height 0.5s cubic-bezier(0.42, 0, 0.58, 1)',
        // 添加其他需要的样式
      }}
    >
      {children}
    </div>
  );
};

export default ExpandableColumn;
