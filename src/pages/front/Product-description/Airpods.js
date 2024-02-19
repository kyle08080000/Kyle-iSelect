import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StickyZoomImage from "../../../components/StickyZoomImage";
import ResizableText from "../../../components/ResizableText";
import airpodsMax from "../../../images/airpods-max.png";
import airpodsMaxGray from "../../../images/airpodsMax gray.png";
import design_comfort__f5 from "../../../images/design_comfort__f5.jpeg";
import design_foam from "../../../images/design_foam.jpg";
import design_mesh from "../../../images/design_mesh.jpg";
import design_crown from "../../../images/design_crown.jpg"

// 使用React.lazy進行動態導入
const ZoomableImage = React.lazy(() => import("../../../components/ZoomableImage"));

function Airpods() {
  const navigate = useNavigate();

  // 準備文字內容陣列
  const textContents = [
    <p className="col-sm-4 mb-20 mb-sm-9 text-black-50">
      耳機頭帶的<span className="text-dark fw-bold">頂部網面</span>是採用通風透氣的網狀編織設計，能分散重量，減輕頭部的壓力感。
    </p>,
    <p className="col-5 col-sm-4 text-black-50">
      <span className="text-dark fw-bold">不鏽鋼框架</span>外面包覆著觸感柔軟的材質，讓堅固、彈性和舒適感成為一種巧妙的組合。
    </p>,
    <p className="col-5 ms-auto mb-sm-20 text-black-50">
      <span className="text-dark fw-bold">伸縮支臂</span>能順暢拉伸調整並固定位置，持續保持服貼密合。
    </p>,
    <p className="col-sm-7 mx-auto mt-14 pt-sm-5 text-black-50 Airpods-textContents">
      <span className="text-dark fw-bold">美觀的陽極處理鋁金屬耳罩</span>採用革命性結構設計，左右耳罩可獨立旋轉並平衡耳部承受的壓力。
    </p>
  ];

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 當組件加載時設置body的背景顏色
    document.body.style.backgroundColor = "#fff";

    // 當組件卸載時重置body的背景顏色
    return () => {
      document.body.style.backgroundColor = "#EDE9E9";
    };
  }, []);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleBuy = () => {
    navigate('/products');
  }

  return (
    <>
      <div className="container mb-3">
        {/* 平板與電腦 */}
        <div className="homepage-container airpods-container d-block position-relative">
          <div className="spinner-container">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="spinner-container">
                <ZoomableImage 
                  className="zoomable-image"
                  src={airpodsMax} 
                />
              </div>
            </Suspense>
          </div>
          <div className="text-slider">
            <h2 className="home-title title-moveAndShrink">
              <ResizableText text="AirPods Max"/>
            </h2>
          </div>
          
          <div 
            className={`d-sm-none w-100 airpods-innertext 
              ${fadeIn ? 'fadeIn' : ''}`
            }>
            <p className=" px-3 fw-bold h5 text-center">
              AirPods Max 全新登場。將令人心動的高傳真音質，和 AirPods 好用巧妙的優勢，進行一場絕美均衡的交融，帶來淋漓盡致的個人聆聽體驗。
            </p>
            <div className="mt-5 text-center">
              <button 
                className="btn btn-primary"
                onClick={handleBuy}
                >
                購買
              </button>
            </div>
          </div>
        </div>
        
        <div className="row px-4 px-md-3 fw-bold airpods-introduce">
          <div className="col-md-7 col-lg-5 mx-auto px-4">
            <p className="d-none d-sm-block w-100 fw-bold h5 airpods-title-p">
              AirPods Max 全新登場。將令人心動的高傳真音質，和 AirPods 好用巧妙的優勢，進行一場絕美均衡的交融，帶來淋漓盡致的個人聆聽體驗。
            </p>
          </div>
          <div className="col-lg-8 mx-auto d-none d-sm-block mb-10 text-center">
            <button 
              className="btn btn-primary"
              onClick={handleBuy}
              >
              購買
            </button>
          </div>
          
          <div className="col-12 mt-5">
            <span className="d-block text-bold">
              設計
            </span>
            <span className="Leading-text">
              徹底原創，<br />
              美聲作品。
            </span>
            <div className="col-md-6 mt-2 mt-sm-5 ms-md-auto ">
              <p>
                耳罩式耳機經過全面重新設計，從耳罩軟墊到頂部網面，AirPods Max 的精心設計，在貼合度方面致力追求完美，就是為了要滿足眾多使用者不同的頭型，創造出最佳的隔音封閉效果，讓你能全然沉浸在美好的聲音裡。
              </p>
            </div>
          </div>
        </div>

        <div className="airpodsZoom">
          <StickyZoomImage 
            src={airpodsMaxGray} 
            maxScale={3} 
            textContents={textContents}
          />

          <div className="airpods-container text-black-50 mb-5">
            <div className="image-main mb-3">
              <img 
                src={design_comfort__f5}
                alt="design_comfort__f5" 
                className="object-cover"
                width="100%"
              />
            </div>
            <div className="text-top p-4 p-sm-0">
              <img 
                src={design_mesh} 
                alt="design_mesh" 
                className="object-cover"
                width="100%"
                />
                <p className="mt-3 mb-5">
                <span className="text-dark fw-bold">特別設計的網狀織物</span>包覆在耳罩軟墊外，在你聆聽時提供靠枕般的柔軟舒適。
              </p>
              <img 
                src={design_foam} 
                alt="design_foam" 
                className="object-cover"
                width="100%"
                />
              <p className="mt-3 mb-sm-5">
                <span className="text-dark fw-bold">耳罩軟墊</span>採用經過聲學工程設計的記憶泡棉，輕柔緊貼雙耳，帶來令人沉醉的封閉效果，正是非凡音色的關鍵。
              </p>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-12 position-relative">
          <img 
              src={design_crown} 
              alt="design_crown" 
              className="object-cover"
              width="100%"
              />
            <p className="mt-3 text-white-50 position-absolute left-0 bottom-0 px-4 px-sm-20">
              按一下<span className="text-light fw-bold">數位旋鈕</span>即可播放及暫停音樂，或在通話時靜音及解除靜音；按兩下即可跳播曲目或結束通話。轉動則可精準控制音量。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Airpods;