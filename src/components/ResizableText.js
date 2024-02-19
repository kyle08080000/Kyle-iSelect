import { useState, useEffect } from 'react';

const ResizableText = ({ text }) => {
    const minScale = 0.8; // 最小缩放比例
    const [scale, setScale] = useState(1); // 初始缩放比例为 1

    useEffect(() => {
        const handleScroll = () => {
            const scrollDistance = window.pageYOffset || document.documentElement.scrollTop;
            const newScale = Math.max(1 - scrollDistance / 3000, minScale); // 根据滚动调整缩放比例

            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            className="position-absolute top-50 start-50 text-nowrap"
            style={{ 
                transform: `translate(-50%, -46%) scale(${scale})` 
            }}
        >
            {text}
        </div>
    );
};

export default ResizableText;
