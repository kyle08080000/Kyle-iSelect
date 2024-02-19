import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOrders from "./pages/admin/AdminOrders";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import Products from "./pages/front/Products";
import ProductDetail from "./pages/front/ProductDetail";
import Cart from "./pages/front/Cart";
import Checkout from "./pages/front/Checkout";
import CartSuccess from "./pages/front/CartSuccess";
import MyOrders from "./pages/front/MyOrders";
import Airpods from "./pages/front/Product-description/Airpods";
import ContactUs from "./pages/front/ContactUs";
import ScrollToTop from "./components/ScrollToTop";

function App() {

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<FrontLayout />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="products" element={<Products />}></Route>
        <Route path="product/:id" element={<ProductDetail />}></Route>
        <Route path="cart" element={<Cart />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route path="success/:orderId" element={<CartSuccess />}></Route>
        <Route path="/airpods" element={<Airpods />}></Route>
        <Route path="/myorders" element={<MyOrders />}></Route>
        <Route path="/contact-us" element={<ContactUs />}></Route>
      </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin" element={<Dashboard />}>
          {/** 產品 */}
          <Route path="products" element={<AdminProducts />}></Route>
          <Route path="coupons" element={<AdminCoupons />}></Route>
          <Route path="orders" element={<AdminOrders />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
