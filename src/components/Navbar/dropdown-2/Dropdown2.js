import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";


const Icon = ({ children, iconRef, className }) => (
  <span ref={iconRef} className={`${className || ""} `}>
    {children}
  </span>
);

const Dropdown2 = ({ name, subMenu }) => {
  const buttonRef = useRef(null);
  const chevronRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState();
  const [menuRight, setMenuRight] = useState();

  // 滑鼠滑入
  const handleMouseEnter = () => {
    if (subMenu && !isOpen) { // 如果有子菜單且目前菜單未開啟
      const buttonRect = buttonRef.current?.getBoundingClientRect(); // 獲取按鈕的位置和尺寸
      const chevronRect = chevronRef.current?.getBoundingClientRect(); // 獲取箭頭圖標的位置和尺寸
  
      if (buttonRect && chevronRect) { // 如果成功獲取到位置和尺寸
        const newMenuRight = buttonRect.right - chevronRect.right; // 計算新的右邊距
        const newMenuTop = chevronRect.top - buttonRect.top; // 計算新的上邊距
        setMenuRight(`${newMenuRight}px`); // 設置菜單的右邊距
        setMenuTop(`${newMenuTop}px`); // 設置菜單的上邊距
      }
      setIsOpen(true); // 設置菜單為開啟狀態
    }
  };
  // 滑鼠滑出
  const handleMouseLeave = () => {
    setMenuRight("0"); // 重置菜單的右邊距
    setMenuTop("78px"); // 重置菜單的上邊距
    setIsOpen(false); // 設置菜單為關閉狀態
  };
  
  const handleClick = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const chevronRect = chevronRef.current?.getBoundingClientRect();

    if (buttonRect && chevronRect && isOpen) {
      const newMenuRight = buttonRect.right - chevronRect.right;
      const newMenuTop = chevronRect.top - buttonRect.top;
      setMenuRight(`${newMenuRight}px`);
      setMenuTop(`${newMenuTop}px`);
    } else {
      setMenuRight("0");
      setMenuTop("78px");
    }

    setIsOpen(!isOpen);
  };


  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`nav-item dropdown2 ${isOpen ? "open" : ""}`}
      >
      <NavLink 
        className="dropdown2Link"
        ref={buttonRef} 
        onClick={handleClick}
      >
        <Icon>{name}</Icon>
        <span>
        </span>
        <Icon iconRef={chevronRef} className="chevron">
          <i className="bi bi-caret-down-fill"></i>
        </Icon>
      </NavLink>
      <div 
        className={`dropdown2Menu ${isOpen ? "open" : ""}`} 
        style={{ right: menuRight, top: menuTop }}
      >
        <div className="h5">
          {subMenu}
        </div>
      </div>
    </div>
  );
};

export default Dropdown2;
