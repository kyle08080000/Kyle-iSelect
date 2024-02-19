import React from 'react';
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageToast from "../../components/MessageToast";
import Navbar from '../../components/Navbar/navbar-1/Navbar';
import logoLg from "../../images/logoLg.png";


function FrontLayout () {
  const [cartData, setCartData] = useState({});

  const getCart = async() => {
    try {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
      );
      // console.log('getCart', res);
      setCartData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCart();    
    // 組件卸載時重置滾動條
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <Navbar cartData={cartData}/>
      <MessageToast />
      <div>
        <Outlet context={{ getCart, cartData }}></Outlet>
      </div>
      <footer className="bg-dark text-light text-lg-start p-5">
        <div className="container p-4">
          <div className="row row-cols-1 row-cols-lg-2 g-3 g-lg-0">
            <div className="col">
              <div className="row">
                <div className="col-6 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">關於我們</h5>
                  <ul className="list-unstyled mb-0">
                    <li><Link to="/" className="text-light">公司</Link></li>
                    <li><Link to="/" className="text-light">社群</Link></li>
                    <li><Link to="/" className="text-light">使用條款</Link></li>
                    <li><Link to="/" className="text-light">退換貨條款</Link></li>
                  </ul>
                </div>
                <div className="col-6 col-md-6 mb-4 mb-md-0">
                  <h5 className="text-uppercase">產品</h5>
                  <ul className="list-unstyled mb-0">
                    <li><Link to="/products" className="text-light">Mac</Link></li>
                    <li><Link to="/products" className="text-light">iPhone</Link></li>
                    <li><Link to="/products" className="text-light">iPad</Link></li>
                    <li><Link to="/products" className="text-light">AirPods</Link></li>
                    <li><Link to="/products" className="text-light">Apple Watch</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row row-cols-1 g-4">
                <div className="col mb-4 mb-md-0">
                  <h5 className="text-uppercase mb-3">訂閱</h5>
                  <form className="d-flex flex-nowrap">
                    <input className="form-control w-75 me-2" type="email" placeholder="輸入您的電子郵件" aria-label="訂閱" />
                    <button className="btn btn-primary text-nowrap" type="submit">前往</button>
                  </form>
                </div>
                <div className="col mb-4 mb-md-0">
                  <h5 className="text-uppercase text-nowrap mb-3">付款方式</h5>
                  <div className="align-self-end mt- h4 text-nowrap">
                    <i className="bi bi-paypal me-2"></i><span className="fst-italic me-5"> PayPal</span> 
                    <i className="bi bi-credit-card-fill me-2"></i><span className="fst-italic"> VISA</span>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row row-cols-1 row-cols-md-3 g-4 align-items-center text-center p-3">
          <div className="col">
            <img src={logoLg} alt="logo" className="w-50" />
          </div>
          <div className="col d-flex justify-content-evenly h1">
            <Link to="/" className="text-reset">
              <i className="bi bi-instagram"></i>
            </Link>
            <Link to="/" className="text-reset">
              <i className="bi bi-facebook"></i>
            </Link>
            <Link to="/" className="text-reset">
              <i className="bi bi-twitter-x"></i>
            </Link>
            {/* <!-- 根據需要新增其他圖標 --> */}
          </div>
          <div className="col">
            <p className="mb-0 text-nowrap">
              © 2024 kyle's iSelect. 版權所有。
            </p>
          </div>
        </div>
      </footer>


    </>
  )
}

export default FrontLayout;