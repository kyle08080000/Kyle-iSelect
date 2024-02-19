import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // 获取当前路径名

  useEffect(() => {
    window.scrollTo(0, 0); // 滚动到页面顶部
  }, [pathname]); // 当路径名变化时触发

  return null; // 该组件不渲染任何东西
};

export default ScrollToTop;