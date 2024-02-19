import React, { useState, useEffect } from 'react';

const ZoomableImage = ({ src, className, }) => {
    const [scale, setScale] = useState(1);
    const maxScale = 2; // 设置最大缩放值

    useEffect(() => {
        const handleScroll = () => {
            const scrollDistance = window.pageYOffset || document.documentElement.scrollTop;
            let newScale = 1 + scrollDistance * 0.00018; // 调整缩放系数
            newScale = Math.min(newScale, maxScale); // 应用最大缩放限制

            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 合并传入的 className 和 zoomable-image
    const combinedClassName = `${className || ''}`.trim();


    return (
      <img 
        src={src} 
        className={`${combinedClassName}`}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }} // 仅应用 scale 变换
        alt="Zoomable" 
      />
    );
};

export default ZoomableImage;
