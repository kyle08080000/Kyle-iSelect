export const menuItems = [ // 定義菜單項目數據
  {
    name: "首頁",
    icon: "house-fill",
    to: "/",
  },
  {
    name: "所有商品",
    icon: "apple",
    to: "/products",
  },
  {
    name: "產品介紹",
    icon: "app-indicator",
    items: [
      { name: "AirPods", 
        icon: "earbuds",
        to: "/airpods", 
      },
      // ...更多子菜单项
    ],
  },
  {
    name: "聯絡我們", 
    icon: "headset", 
    to: "/contact-us",
  },
  {
    name: "帳戶",
    icon: "person-fill", 
    items: [
      { name: "我的訂單", 
        icon: "menu-button",
        to: "/myorders",
      },
      { name: "後臺登入", 
        icon: "box-arrow-in-right",
        to: "/login",
      },
      // ...更多子菜单项
    ],
  },
  
];