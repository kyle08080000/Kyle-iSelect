import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CancelOrderModal from '../../components/CancelOrderModal';
import { LoaderHashLoader } from '../../components/Loaders/ReactSpinners';
import noOrder from "../../images/noOrder.png";
import Pagination from '../../components/Pagination';


const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null); // 新增一個狀態來跟踪選中的訂單
  const [showCancelModal, setShowCancelModal] = useState(false); // 控制取消訂單模態視窗的顯示
  const [cancelOrderInfo, setCancelOrderInfo] = useState(null); // 存儲要取消的訂單資訊
  const [cancelingOrders, setCancelingOrders] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  // 函數用於從 cookie 中獲取特定名稱的值
  const getCookieValue = useCallback((name) => (
    document.cookie
      .split('; ')
      .find(row => row.startsWith(name))
      ?.split('=')[1]
  ), []);

  const getOrders = useCallback(async (page = 1) => {
    const token = getCookieValue('hexToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    } else {
      console.log('No token found!');
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`,
      );
      const validOrders = res.data.orders.filter((_, index) => index !== 0);
      setOrders(validOrders);
      setPagination(res.data.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [navigate, getCookieValue]); // 确保依赖项正确

  useEffect(() => {
    getOrders(); // 初始加载
  }, [getOrders]);

  
  // 切換訂單詳細資訊的顯示
  const handleOrderSelect = (orderId) => {
    // 如果当前点击的订单已经是选中状态，则将其设置为null来折叠订单详情
    setSelectedOrderId(prevOrderId => prevOrderId === orderId ? null : orderId);
  };

  // 這個函式將 Unix 時間戳（秒）轉換為本地時間字符串
  const convertTimestampToLocalTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 新增開啟取消訂單模態視窗的函數
  const handleOpenCancelModal = (event, order) => {
    event.stopPropagation(); // 阻止事件冒泡
    setCancelOrderInfo(order); // 設置要取消的訂單資訊
    setShowCancelModal(true); // 顯示模態視窗
  };

  // 新增關閉取消訂單模態視窗的函數
  const handleCloseCancelModal = () => {
    setShowCancelModal(false); // 隱藏模態視窗
  };

  const handleConfirmCancel = (orderId) => {
    setCancelingOrders(prev => ({ ...prev, [orderId]: true }));
  };

  // 禁用右键菜单
  const preventDefaultAction = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container my-10">
      <h2 className="mb-4">您的歷史訂單</h2>
      <div className="row mx-2 mx-md-0">
        <div className="col-12 col-md-6">
          {isLoading ? <LoaderHashLoader /> : orders.length > 0 ? (
            orders?.map((order) => (
              <div key={order.id} className="row mb-3 ">
                <div
                  className="order-summary card px-0"
                  onClick={() => handleOrderSelect(order.id)}
                  // style={{ cursor: 'pointer' }}
                >
                  <div 
                    className={`card-header d-flex ${selectedOrderId === order.id ? 'bg-info' : 'bg-light'}`}
                    onClick={() => handleOrderSelect(order.id)}
                  >
                    <span className={`d-inline-block fw-bold ${selectedOrderId === order.id ? 'text-light' : 'text-dark'}`}>
                      訂單日期：
                    </span>
                    <span className='d-inline-block ms-auto text-secondary fw-bold'>
                      {convertTimestampToLocalTime(order.create_at)}
                    </span>
                  </div>
                  <div className="row card-body justify-content-between">
                    <div className="col-12">
                      <span className='d-block'>訂單編號: <span className=''>{order.id}</span></span>
                    </div>
                    <div className="col">
                      <span className=''>訂單狀態: </span>
                      {order.is_paid ? (
                        <span className='badge bg-success fw-bold'>付款完成</span>
                      ) : (
                        <span className='badge bg-warning text-dark rounded-pill'>未付款</span>
                      )}
                    </div>
                    <div className="col">
                      <span className='d-block text-end'>
                        <span className=''>總計: </span>${order.total}
                      </span>
                    </div>
                    
                  </div>
                  {selectedOrderId === order.id && (
                    <div 
                      className={`order-details mx-3 mb-3 border rounded bg-light ${selectedOrderId === order.id ? 'expanded' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ul className=" list-group list-group-flush">
                        {order.products && Object.values(order.products).map((productDetail) => (
                          <li 
                            key={productDetail.id} 
                            className=" list-group-item"
                            >
                            <div className="row row-cols-3 justify-content-between align-items-center">
                              <div className="col-12">
                                <h5 className="mb-1">{productDetail.product.title}</h5>
                              </div>
                              <div className="col">
                                <span className='d-block mb-2'>數量: </span>
                                <span className='d-block mb-2'>金額: </span>
                              </div>
                              <div className="col">
                                <span className='d-block mb-2'>{productDetail.qty}x</span>
                                <span className="d-block mb-2 fw-bold">${productDetail.total}</span>
                              </div>
                              <div className="col">
                                <img 
                                  src={productDetail.product.imageUrl} 
                                  alt={productDetail.product.title}
                                  className="object-cover"
                                  width={80}
                                  height={100}
                                  />
                              </div>
                            </div>
                          </li>
                        ))}
                        <li className="list-group-item col-12 ">
                          <span className='d-block mb-2'>運送地址: </span>
                          <span className='d-block mb-2'>{order.user.address}</span>
                        </li>
                      </ul>
                      <div className="text-end my-2 me-2">
                        {/* 在渲染每個訂單按鈕時，檢查該訂單是否正在取消中 */}
                        {cancelingOrders[order.id] ? (
                          <button className="btn btn-secondary" disabled>取消訂單申請中</button>
                        ) : (
                          <button className="btn btn-primary" onClick={(e) => handleOpenCancelModal(e, order)}>我想取消訂單</button>
                        )}
                        <CancelOrderModal
                          show={showCancelModal}
                          handleClose={handleCloseCancelModal}
                          orderInfo={cancelOrderInfo}
                          onConfirmCancel={handleConfirmCancel} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (<img 
                src={noOrder} 
                alt="No Orders" 
                style={{ width: "100%", height: "auto" }} 
                onContextMenu={preventDefaultAction}
                draggable="false"
              />)
          }
          <div className="d-flex justify-content-center">
            <Pagination 
              pagination={pagination}
              changePage={getOrders}
            />
          </div>
        </div>
        <div className="col d-none d-md-block">
          <div className="card">
            <div className="card-header bg-dark text-light">
              退貨退款須知
            </div>
            <div className="card-body">
              <h5 className="card-title">感謝您的購買</h5>
              <p className="card-text">如果您對所購商品不完全滿意，我們提供退貨退款服務。</p>
              
              <h6>退貨條件</h6>
              <ul>
                <li>商品必須在購買後的30天內退回。</li>
                <li>商品必須處於未使用狀態，並保持原包裝和標籤。</li>
                <li>提供有效的購買憑證（例如收據或訂單確認郵件）。</li>
                <li>特價商品、個人定制商品或一次性使用商品不適用退貨。</li>
              </ul>

              <h6>退貨流程</h6>
              <ol>
                <li>聯繫我們的客服部門，索取退貨授權和地址。</li>
                <li>將商品連同購買憑證一起打包。</li>
                <li>使用我們提供的貨運或您選擇的任何貨運服務退回商品。</li>
                <li>當我們收到退貨商品並確認其狀態後，我們將處理退款。</li>
              </ol>

              <h6>退款詳情</h6>
              <p>退款將退回至您原支付的賬戶。退款包含商品價格及您支付的任何稅費，但不包括任何運費。請允許2-4週的時間處理退款。</p>

              <p>如果您有任何關於退貨退款的問題，請隨時聯繫我們的客服團隊。</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MyOrders;
