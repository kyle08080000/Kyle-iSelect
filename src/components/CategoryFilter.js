import React, { useState } from 'react';

function CategoryFilter({ onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  // 假設這是您想要顯示的導航欄位文字
  const displayNames = {
    '全部': 'All',
    '筆記型電腦': 'Mac',
    '智能手機': 'iPhone',
    '平板': 'iPad',
    '耳機': 'AirPods',
    '智能手錶': 'Apple Watch',
  };
  
  // 這是實際的產品類別
  const categories = Object.keys(displayNames);

  const handleCategoryClick = (e, category) => {
    e.preventDefault(); // 阻止<a>標籤的默認跳轉行為
    setActiveCategory(category);
    onCategoryChange(category); // 這裡傳遞的是實際的類別值
    window.scrollTo(0, 0); // 在这里添加代码来滚动到页面顶部
  };

  return (
    <nav className="nav nav-pills nav-fill my-3 bg-light rounded-3 category-Filter border">
      {categories.map((category) => (
        <a
          key={category}
          className={`nav-link text-nowrap ${activeCategory === category ? 'active' : ''}`}
          href={`#${category}`} // 使用 # 來適應 HashRouter
          onClick={(e) => handleCategoryClick(e, category)}
        >
          {displayNames[category]}
        </a>
      ))}
    </nav>
  );
}

export default CategoryFilter;
