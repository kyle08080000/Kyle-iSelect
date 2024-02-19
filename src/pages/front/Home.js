import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iphone from '../../images/iPhone15Pro.png';
import mac from '../../images/mac.png';
import airPodsMax from '../../images/airpods-max.png';
import ResizableText from '../../components/ResizableText';
import ZoomableImage from '../../components/ZoomableImage';
// 使用React.lazy進行ZoomableImage組件的動態導入

function Home () { 
  const imageUrls = useMemo(() => [
    airPodsMax,
    iphone,
    mac,
  ], []);

  const text = [
    "AirPods Max",
    "iPhone 15 Pro",
    "MacBook Pro",
  ]
  
  const navigate = useNavigate();

  // 状态来追踪当前显示的图片索引與標題
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  // 追踪「商品介紹 +」
  const [showCategoriesBtn, setShowCategoriesBtn] = useState(false);
  const [categoriesBtnAnimation, setCategoriesBtnAnimation] = useState('');
  const [showSwipeHint, setShowSwipeHint] = useState(false); // 控制是否显示提示左右滑動
  const [hintOpacity, setHintOpacity] = useState(0); // 控制提示的透明度
  

  // 切换到下一张图片
  const handleNextImage = () => {
    const currentImage = document.querySelector('.zoomable-image');
    const currentTitle = document.querySelector('.home-title');
    const nextImageIndex = (currentImageIndex + 1) % imageUrls.length;
    const nextTitleIndex = (currentTextIndex + 1) % text.length;

    // 當前圖片和文字退出動畫
    currentImage.classList.add('slide-out-up');
    currentTitle.classList.add('slide-out-left');

    // 設置延遲以等待當前圖片和文字退出動畫完成
    setTimeout(() => {
      // 更新圖片和文字索引
      setCurrentImageIndex(nextImageIndex);
      setCurrentTextIndex(nextTitleIndex);

      // 清除退出動畫的類別
      currentImage.classList.remove('slide-out-up');
      currentTitle.classList.remove('slide-out-left');

      // 為新圖片和文字添加進入動畫的類別
      currentImage.classList.add('slide-in-up');
      currentTitle.classList.add('slide-in-right');

      // 再次設置延遲以清除進入動畫的類別，以便下次可以再次使用
      setTimeout(() => {
        currentImage.classList.remove('slide-in-up');
        currentTitle.classList.remove('slide-in-right');
      }, 500); // 與動畫時間相同
    }, 500); // 動畫時間
  };

  // 切换到上一张图片
  const handlePrevImage = () => {
    const currentImage = document.querySelector('.zoomable-image');
    const currentTitle = document.querySelector('.home-title');
    const prevImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;

    // 當前圖片退出動畫
    currentImage.classList.add('slide-out-down');
    currentTitle.classList.add('slide-out-down');

    // 設置延遲以等待當前圖片退出動畫完成
    setTimeout(() => {
      // 更新圖片索引
      setCurrentImageIndex(prevImageIndex);
      setCurrentTextIndex(prevImageIndex);

      // 清除退出動畫的類別
      currentImage.classList.remove('slide-out-down');
      currentTitle.classList.remove('slide-out-down');

      // 為新圖片添加進入動畫的類別
      currentImage.classList.add('slide-in-down');
      currentTitle.classList.add('slide-in-down');

      // 再次設置延遲以清除進入動畫的類別，以便下次可以再次使用
      setTimeout(() => {
        currentImage.classList.remove('slide-in-down');
        currentTitle.classList.remove('slide-in-down');
      }, 500); // 與動畫時間相同
    }, 500); // 動畫時間
  };

  // 商品詳情
  const handleCategoriesClick = () => {
    const circle = document.querySelector('.circle-background');
    if (circle) {
      circle.classList.add('expanded');

      // 检测屏幕宽度，根据结果应用不同的样式
      if (window.innerWidth < 768) { // 假定768px为手机与平板的分界点
        // 手机样式
        circle.style.width = '1300px';
        circle.style.height = '1300px'; // 在手机的情况下，height 被设置为 200vh（视口高度的两倍），这可能会导致圆形变为一个垂直方向拉伸的椭圆形，因为 height 是基于视口高度的，而 width 是基于视口宽度的。
      } else {
        // 平板样式
        circle.style.width = '200vw';
        circle.style.height = '200vw'; // 在平板和电脑的情况下，height 和 width 都被设置为 200vw，这将确保无论视口的宽高比是多少，扩展后的形状都保持为一个正圆形。
      }
      // circle.style.top = '50%';
      // circle.style.left = '50%';
      // circle.style.transform = 'translate(-50%, -50%)';
  
      // 设置延迟以后跳转到 `/airpods` 路由
      setTimeout(() => {
        navigate('/airpods');
      }, 500);
    }
  };

  // 当图片索引发生变化时调用
  useEffect(() => {
    if (imageUrls[currentImageIndex] === airPodsMax) {
      setShowCategoriesBtn(true);
      setCategoriesBtnAnimation('categories-btn-enter');
    } else if (showCategoriesBtn) {
      setCategoriesBtnAnimation('categories-btn-exit');
  
      // 等动画结束后再隐藏按钮
      const timer = setTimeout(() => {
        setShowCategoriesBtn(false);
      }, 500); // 与 CSS 动画时间相同
  
      // 清除定时器
      return () => clearTimeout(timer);
    }
  }, [currentImageIndex, showCategoriesBtn, imageUrls]);

  // 購買
  const handlePurchaseClick = () => {
    const titlemoveAndShrink = document.querySelector('.title-moveAndShrink');
    const currentImage = document.querySelector('.zoomable-image');
    const circle = document.querySelector('.circle-background');
    
    // 触发 AirPods Max 缩小并移动到顶部的动画
    titlemoveAndShrink.classList.add('shrink');
    // 當前圖片 退出動畫
    currentImage.classList.add('slide-out-down');

    if (circle) {
      // 检测屏幕宽度，根据结果应用不同的样式
      if (window.innerWidth < 768) { // 假定768px为手机与平板的分界点
        // 手机样式
        circle.style.width = '0vw';
        circle.style.height = '0vh';
        // circle.style.top = '50%';
        // circle.style.left = '-30%';
      } else {
        // 平板样式
        circle.style.width = '0vw';
        circle.style.height = '0vw';
        // circle.style.top = '50%';
        // circle.style.left = '50%';
      }
      circle.style.transform = 'translate(-50%, -50%)';
    }

    fadeOutButtons();

    setTimeout(() => {
      navigate('/products');
    }, 1000); 
  };

  // 移出按鈕
  function fadeOutButtons() {
    const categoriesBtn = document.querySelector('.categories-btn');
    const buyBtn = document.querySelector('.buy-btn');
    const btnPrevious = document.querySelector('.btn-previous');
    const btnNext = document.querySelector('.btn-next');

    if (categoriesBtn) categoriesBtn.classList.add('out');
    if (buyBtn) buyBtn.classList.add('out');
    if (btnPrevious) btnPrevious.classList.add('out');
    if (btnNext) btnNext.classList.add('out');
  }

  // 手機觸控
  let touchStartX = 0;
  let touchEndX = 0;

  // 觸摸開始時的處理函數
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  // 觸摸結束時的處理函數
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 100) {
      // 向左滑動
      handleNextImage();
    } else if (touchStartX - touchEndX < -100) {
      // 向右滑動
      handlePrevImage();
    }
  }

  // 禁止用戶上下滑動
  useEffect(() => {
    let startY = 0; // 触摸开始的Y坐标
  
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY; // 记录开始触摸时的Y坐标
    };
  
    const handleTouchMove = (e) => {
      const moveY = e.touches[0].clientY; // 触摸移动时的Y坐标
      const diffY = moveY - startY; // 计算Y坐标的变化量
  
      if (Math.abs(diffY) > 0) { // 如果有垂直方向的移动，则阻止默认行为
        e.preventDefault();
      }
    };
  
    // 组件挂载时添加事件监听
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
  
    // 组件卸载时移除事件监听
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  

  // 左右滑動提示
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // 检测是否为手机设备
    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint'); // 从localStorage中获取标记
  
    setShowSwipeHint(true); // 准备显示提示
    if (isMobile && !hasSeenSwipeHint) {
      setTimeout(() => {
        setHintOpacity(1); // 淡入效果
    
        // 提示显示一段时间后开始淡出
        setTimeout(() => {
          setHintOpacity(0); // 开始淡出
    
          // 淡出完成后隐藏提示，并在localStorage中标记用户已看到提示
          setTimeout(() => {
            setShowSwipeHint(false); // 最终隐藏提示
            localStorage.setItem('hasSeenSwipeHint', 'true'); // 标记用户已看到提示
          }, 1000); // 等待淡出动画完成
        }, 2000); // 提示显示2秒后开始淡出
      }, 2000); // 页面加载1秒后显示提示
    }
  }, []);


  return (
    <>
      <div 
        className="position-relative home-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        >
        <div className="circle-background"></div>
        <div className="container">
          <button
            type="button"
            onClick={handlePrevImage}
            className="btn d-none d-sm-block btn-previous"
            >
            <i className="bi bi-arrow-left-circle-fill h1"></i>
          </button>
          <button
            type="button"
            onClick={handleNextImage}
            className="btn d-none d-sm-block btn-next"
            >
            <i className="bi bi-arrow-right-circle-fill h1"></i>
          </button>
          <div 
            className="homepage-container">
            <div className="spinner-container">
              <ZoomableImage 
                className="zoomable-image"
                src={imageUrls[currentImageIndex]} 
              />
            </div>
            <div className="text-slider">
              <h2 className="home-title title-moveAndShrink">
                <ResizableText text={text[currentTextIndex]}/>
              </h2>
            </div>
            {showSwipeHint && (
              <div
                className="swipe-hint"
                style={{opacity: hintOpacity}} // 应用透明度状态
              >
                左右滑動看看 <i className="bi bi-arrows"></i>
              </div>
            )}
            {showCategoriesBtn && (
              <button
                type="button"
                className={`categories-btn btn ${categoriesBtnAnimation}`}
                onClick={handleCategoriesClick}
                
              >
                商品介紹 +
              </button>
            )}
            <button
              type="button"
              className="buy-btn btn"
              onClick={handlePurchaseClick}
            >
              購買 <i className="bi bi-bag"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;
