import axios from "axios";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux"; // 用於 吐司元件 
import { createAsyncMessage } from "../../slice/messageSlice"; // 用於 吐司元件
import MyCoupons from "../../components/CouponCard";
import cartIscleanImg from "../../images/cartIsclean.png";

function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItem] = useState([]);
  const [couponCode, setCouponCode] = useState(''); // 新增一個狀態來跟踪優惠卷代碼
  const [couponDiscount, setCouponDiscount] = useState(0); // 追蹤優惠卷折扣的金額
  const [isDisabled, setIsDisabled] = useState(false); // 追踪按钮的禁用状态

  const dispatch = useDispatch();
  console.log(cartData);
  
  //  刪除品項
  const removeCartItem = async(id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`,
      );
      getCart();
      console.log('刪除品項',res);
    } catch (error) {
      console.log(error);
    }
  }

  //  更新品項
  const updateCartItem = async(item, quantity) => {
    const data = {
      "data": {
        "product_id": item.product_id,
        "qty": quantity
      }
    };
    setLoadingItem([...loadingItems, item.id]); // 帶入原本的陣列與當前的id，用於禁用下拉選單
    try {
      const res = await axios.put(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`,
        data,
      );
      console.log('更新品項',res);
      setLoadingItem(
        loadingItems.filter((loadingObject) => loadingObject !== item.id), // 把產品篩選出來。這樣當使用 loadingItems.includes 時，就可以禁用到對的下拉選單！
      );
      dispatch(createAsyncMessage(res.data)); 
      getCart();
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data)); 
      setLoadingItem(
        loadingItems.filter((loadingObject) => loadingObject !== item.id), // 把產品篩選出來。這樣當使用 loadingItems.includes 時，就可以禁用到對的下拉選單！
      );
    }
  }

  // 處理優惠卷提交
  const handleCouponSubmit = async () => {
    setIsDisabled(true);
    try {
      const response = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/coupon`, {
        data: { code: couponCode },
      });
      console.log('couponCode', response);
      dispatch(createAsyncMessage(response.data));
      if (response.data.success) {
        const discountAmount = cartData.total - response.data.data.final_total;
        setCouponDiscount(discountAmount);
      }           
      getCart();
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
    setTimeout(() => setIsDisabled(false), 3500);  // 3秒后重新启用按钮
  };

  // 禁用右键菜单
  const preventDefaultAction = (event) => {
    event.preventDefault();
  };


  return (
    <>
      <div className="container my-11 overflow-hidden">
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col card bg-white pb-4 mb-4 align-self-start" style={{ zIndex: '2' }}>
            <div className="text-center py-3">
              <h2 className="m-0">您的購物車</h2>
            </div>
            {cartData?.carts && cartData.carts.length > 0 ? (
              cartData?.carts?.map((item) => {
              return (
                <div className="row position-relative g-lg-0 mt-2 mx-2 py-2 bg-light " key={item.id}>
                  <div className="col-4">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title}
                      className="object-cover ms-2" // 必免圖片變形
                      style={{
                        width: '90px',
                        height: '90px',
                      }} 
                    />
                  </div>
                  <div className="col-8">
                    <div className="w-100 py-3 ">
                      <p className="mb-0 fw-bold text-truncate">
                        {item.product.title}
                      </p>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="input-group w-50 align-items-center">
                          <select name="" className="form-select" id=""
                            value={item.qty} // 傳入的是原本產品數量
                            disabled={loadingItems.includes(item.id)} // 當品項id包含在 loadingItems 時禁用此按鈕
                            onChange={
                              (e) => {
                                updateCartItem(item, e.target.value * 1); // 因為透過 e.target 選擇，所以傳入的數會是字串形式，所以透過乘於 1來轉換成數字型別
                              }
                            }
                          >
                          {
                            [...(new Array(20))].map((i, num) => {
                              return (
                                <option value={num + 1} key={num}>{num + 1}</option>
                              )
                            })
                          }
                          </select>
                        </div>
                        <p className="mb-0 ms-auto me-lg-8">NT$ {item.final_total}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="position-absolute btn" 
                    style={{
                      top: '10px', 
                      right: '0px',
                      width: '44px'
                    }}
                    onClick={() => removeCartItem(item.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              )
            })) : (
              // 購物車為空時顯示的圖片或消息
              <img 
                src={cartIscleanImg} 
                alt="購物車為空" 
                className="w-100"
                onContextMenu={preventDefaultAction} 
                draggable="false"
              />
            )}
          </div>
          <div className="col pricing-info text-muted">
            <div className="row pricing-info-row">
              <div className="col-12 my-5">
                <MyCoupons />
              </div>
              <div className="col-10 col-lg-8 mx-auto mt-lg-4">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="輸入優惠卷代碼"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleCouponSubmit}
                    disabled={isDisabled}
                  >
                    套用優惠卷
                  </button>
                </div>
                <div className="d-flex">
                  <span className="d-inline-block me-3">商品總計:</span>
                  <span className="d-inline-block">NT${cartData.total}</span>
                </div>
                <div className="d-flex">
                  <span className="d-inline-block me-3">優惠卷折抵:</span>
                  {couponDiscount > 0 ? (
                    <span className="d-inline-block">NT$ -{couponDiscount}</span>
                  ) : (
                    <span className="d-inline-block text-secondary">尚未使用</span>
                  )}
                </div>
                <div className="d-flex mt-4 fw-bold">
                  <span className="h4 d-inline-block me-3">總金額:</span>
                  <span className="h4">NT$ {cartData.final_total}</span>
                </div>
                {cartData?.carts && cartData.carts.length > 0 ? (
                  <Link 
                    to="/checkout" 
                    className="btn btn-dark w-100 mt-4 rounded-0 py-3"
                    state={{ couponDiscount: couponDiscount }}
                  >
                    確認項目正確
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart;