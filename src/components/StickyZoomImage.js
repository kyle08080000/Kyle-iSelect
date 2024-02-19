import React, { useState, useEffect, useRef } from 'react';

const StickyZoomImage = ({ src, maxScale, textContents }) => {
  const initialScale = 0.4;
  const [scale, setScale] = useState(initialScale);
  const [isZoomed, setIsZoomed] = useState(false);
  const [textOpacities, setTextOpacities] = useState(new Array(textContents.length).fill(0));
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollDistance = window.pageYOffset;
      const newScale = Math.max(initialScale, 1 + scrollDistance / 500);
      setScale(Math.min(newScale, maxScale));
      setIsZoomed(newScale >= maxScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxScale, initialScale]);

  useEffect(() => {
    const handleTextVisibility = () => {
      if (!containerRef.current) return;
  
      const containerTop = containerRef.current.offsetTop;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
  
      let newOpacities = [...textOpacities]; // 復制當前的透明度數組
  
      textContents.forEach((_, index) => {
        if (index === 0) {
          // 第一個文本顯示邏輯
          const startOffsetForFirst = containerTop / 2;
          if (scrollY > startOffsetForFirst) {
            newOpacities[index] = Math.min(1, (scrollY - startOffsetForFirst) / (windowHeight / 2));
          }
        } else {
          // 後續文本的顯示邏輯
          const startOffsetForOthers = containerTop / 4 + windowHeight / 2 * index + windowHeight / 4;
          if (scrollY > startOffsetForOthers && newOpacities[index - 1] === 1) {
            // 只有當前一個文本完全顯示（透明度為1），才計算當前文本的透明度
            newOpacities[index] = Math.min(1, (scrollY - startOffsetForOthers) / (windowHeight / 2));
          }
        }
      });
  
      setTextOpacities(newOpacities);
    };
  
    window.addEventListener('scroll', handleTextVisibility);
    return () => window.removeEventListener('scroll', handleTextVisibility);
  }, [textContents.length, textContents, containerRef, textOpacities]);
  
  

  const containerStyle = isZoomed ? {} : { position: 'sticky', top: 0 };

  return (

      <div className="sticky-zoom-container" style={containerStyle} ref={containerRef}>
        <img 
          src={src} 
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }} 
          className="sticky-image"
          alt="zoomable"
        />
        <div className="text-content" style={{ position: 'absolute', left: '70%' }}>
          {textContents.map((content, index) => (
            <div key={index} style={{ opacity: textOpacities[index] }}>
              {content}
            </div>
          ))}
        </div>
      </div>
  );
};

export default StickyZoomImage;
