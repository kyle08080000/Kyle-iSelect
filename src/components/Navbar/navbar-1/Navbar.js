import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuItems } from '../menuItems'; // 假設這是你的菜單項目資料
import { Sidebar } from '../sidebar-10/Sidebar';
import Dropdown2 from '../dropdown-2/Dropdown2';
import logo from '../../../images/logo3.png';
import mobileLogo from '../../../images/logoLg.png';

const Navbar = ({ cartData }) => {
  const lastScrollTop = useRef(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const { pageYOffset } = window;
      if (pageYOffset > lastScrollTop.current) {
        setIsNavbarVisible(false);
      } else if (pageYOffset < lastScrollTop.current) {
        setIsNavbarVisible(true);
      }
      lastScrollTop.current = pageYOffset <= 0 ? 0 : pageYOffset;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    // 定義 Icon 組件
    const Icon = ({ icon }) => (
      <span className="material-symbols-outlined">
        <i className={`me-2 bi bi-${icon}`}></i> {/* 使用 Bootstrap Icons 的類名 */}
      </span> // 使用 material icons 渲染圖標
    );

  // 渲染子菜單的函數
  const renderSubMenu = (items) => {
    return (
      <div className="submenu d-flex flex-column">
        {items.map((subItem, index) => (
          <NavLink key={index} to={subItem.to} className="submenu-item py-2 text-light text-nowrap">
            {subItem.icon && <Icon icon={subItem.icon} />}
            {subItem.name}
          </NavLink>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav className={`
          navbar-1 
          d-flex
          justify-content-between
          align-items-center
          px-md-4
          ${isNavbarVisible ? 'visible' : ''}

        `}
        >
        {/* 平板＆電腦 logo */}
        <NavLink to="/" className="logo h4 m-0 d-none d-md-block">
          <img 
            src={logo} 
            alt="logo" 
            className="object-cover"
            width={150}
            />
        </NavLink>
        {/* 手機logo */}
        <NavLink to="/" className="logo h4 m-0 d-md-none position-absolute top-50 start-50 translate-middle">
          <img 
            src={mobileLogo} 
            alt="logo" 
            className="object-cover"
            width={80}
            />
        </NavLink>
        {/* 平板與電腦 導航欄 */}
        <div className=" d-none d-sm-block d-flex justify-content-center">
          <div className="nav-items d-none d-sm-block">
            {menuItems.map((item, index) => {
              // 如果有子菜單項目，則渲染一個含有子連結的下拉菜單
              if (item.items && item.items.length > 0) {
                return (
                  <div key={index} className="">
                    <Dropdown2
                      className="nav-item dropbtn btn"
                      name={item.name}
                      subMenu={renderSubMenu(item.items)}
                    />
                  </div>
                );
              }
              // 如果沒有子菜單項目，則渲染一個單獨的 NavLink
              return (
                <NavLink key={index} to={item.to} className="nav-item">
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
        {/* 購物車 */}
        <div className=" d-flex cart me-4 ps-8">
          <NavLink to="/cart" className="nav-link position-relative">
            <i className="bi bi-cart4 cart-icon"></i>
            {cartData.carts && cartData.carts.length > 0 && (
              <span className="cart-badge badge rounded-pill bg-danger">
                {cartData.carts.length}
              </span>
            )}
          </NavLink>
        </div>
        <div className="d-sm-none">
          {/* 移動端的側邊欄 */}
          <Sidebar />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
