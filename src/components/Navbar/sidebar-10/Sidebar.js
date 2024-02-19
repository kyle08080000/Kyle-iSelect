import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuItems } from '../menuItems'; // 假設您有一個 menuItems.js 檔案來定義菜單數據
import logo from '../../../images/logo3.png';

// 定義 Icon 組件
const Icon = ({ icon }) => (
  <span className="material-symbols-outlined">
    <i className={`bi bi-${icon}`}></i> {/* 使用 Bootstrap Icons 的類名 */}
  </span> // 使用 material icons 渲染圖標
);

// 定義導航欄頭部組件
const NavHeader = () => (
  <header className="sidebar-header py-5">
    <button className="d-none" type="button">
      <Icon icon="list" /> {/* 菜單按鈕 */}
    </button>
    <img 
      src={logo} 
      alt="logo" 
      className="object-cover ms-auto"
      width={150}
      />
  </header>
);

// 定義導航按鈕組件
const NavButton = ({ onClick, name, icon, isActive, hasSubNav, to, toggleMenu }) => {
  const handleNavClick = () => {
    onClick(name);
    if (to && !hasSubNav) {  // 如果有導航路徑且沒有子菜單，則關閉漢堡選單
      toggleMenu();
    }
  };

  if (to) {
    return (
      <NavLink to={to} className={isActive ? "sidebar-subItem active" : "sidebar-subItem"} onClick={handleNavClick}>
        {icon && <Icon icon={icon} />}
        <span>{name}</span>
      </NavLink>
    );
  }
  return (
    <button type="button" onClick={handleNavClick} className={`sidebar-subItem ${isActive ? "active" : ""}`}>
      {icon && <Icon icon={icon} />}
      <span>{name}</span>
      {hasSubNav && <Icon icon="bi bi-caret-down" />}
    </button>
  );
};


// 定義子菜單組件
const SubMenu = ({ item, activeItem, handleClick, toggleMenu }) => {
  const navRef = useRef(null);
  

  const isSubNavOpen = (itemName, items) => {
    return items?.some((item) => item.name === activeItem) || itemName === activeItem;
  };

  return (
    <div 
      className={
        `sub-nav 
        ${isSubNavOpen(item.name, item.items) ? "open" : ""}`
      } 
      style={{ 
        height: !isSubNavOpen(item.name, item.items) ? 0 : navRef.current?.clientHeight + 10
      }}>
      <div ref={navRef} className="sub-nav-inner">
        {item.items?.map((subItem, index) => (
          <NavLink 
            key={index} 
            to={subItem.to} 
            className={({ isActive }) => (isActive ? "sidebar-subItem active" : "sidebar-subItem")} 
            onClick={() => { handleClick(subItem.name); toggleMenu(); }} // 自動關閉漢堡選單
          >
            {subItem.icon && <Icon icon={subItem.icon} />}
            <span>{subItem.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// 導出側邊欄組件
export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  
    // 切換 body 的 overflow 樣式來控制滾動
    if (!isOpen) {
      document.body.style.overflow = 'hidden'; // 禁止滾動
    } else {
      document.body.style.overflow = 'auto'; // 恢復滾動
    }
  };
  

  const handleClick = (item) => {
    console.log("activeItem", activeItem);
    setActiveItem(item !== activeItem ? item : "");
  };

  return (
    <>
      <nav className="mobile-nav">
        <button 
          className={`burger mt-2 ms-3 btn btn-dark ${isOpen ? "open" : ""}`} 
          onClick={toggleMenu}
        >
        </button>
        <div className={`menu ${isOpen ? "open" : ""}`}>
          <aside className="sidebar">
            <NavHeader />
            {menuItems.map((item, index) => (
              <div key={index}>
                {!item.items && 
                  <NavButton 
                    onClick={handleClick} 
                    name={item.name} 
                    icon={item.icon} 
                    isActive={activeItem === item.name} 
                    hasSubNav={!!item.items} 
                    to={item.to} 
                    toggleMenu={toggleMenu} // 傳遞 toggleMenu
                  />}
                {item.items && (
                  <>
                    <NavButton 
                      key={index} 
                      onClick={handleClick} 
                      name={item.name} 
                      icon={item.icon} 
                      isActive={activeItem === item.name} 
                      hasSubNav={!!item.items} 
                      toggleMenu={toggleMenu} // 傳遞 toggleMenu
                    />
                    <SubMenu 
                      activeItem={activeItem} 
                      handleClick={handleClick} 
                      item={item} 
                      toggleMenu={toggleMenu} // 傳遞 toggleMenu
                      />
                  </>
                )}
              </div>
            ))}
          </aside>
        </div>
      </nav>
    </>
  );
};
