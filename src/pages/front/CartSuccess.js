import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { LoaderPulseLoader } from "../../components/Loaders/ReactSpinners";

function CartSuccess() { 
  const { orderId } = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState({});
  const paymentMethod = state?.paymentMethod;

  const getCart = async(orderId) => {
    const res = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/order/${orderId}`,
      );
      console.log('訂單資訊',res);
      setOrderData(res.data.order); // 將訂單資料存入。接下來就可以透過 orderData 來操作資料
  }

  useEffect(() => {
    getCart(orderId);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [orderId]);

  return (
    <>
      <div className="container mt-10 pb-5">
        {isLoading ? <LoaderPulseLoader /> : (
          <div className="mt-5">
            <div className="row">
              <div className="col-12">
                <h2 className="mb-4">
                  <i className="bi bi-check-circle-fill me-3"></i>我們已經收到您的訂單！
                </h2>
              </div>
            </div>
            <div className="row flex-column-reverse flex-md-row">
              <div className="col-md-6">
                <p className="h5">感謝您的購買。您的訂單編號是：
                  <Link 
                    to="/myorders" 
                    className="ms-2 text-info fw-bold text-decoration-underline"
                  >
                    {orderData.id}
                  </Link>
                </p>
                <p className="h5">您可以通過
                  <Link 
                    to="/myorders" 
                    className="mx-2 text-info fw-bold text-decoration-underline"
                  >
                    我的訂單
                  </Link>來追蹤您的訂單狀態。
                </p>
                <h3 className="mt-5">付款方式：</h3>
                  <p className="mb-0 d-inline-block me-3">
                    {paymentMethod === 'cashOnDelivery' ? '貨到付款' : 'PayPal'}
                  </p>
                  {orderData.is_paid ? (
                    <span className='badge bg-primary fw-bold'>付款完成</span>
                  ) : (
                    <span className='badge bg-warning text-dark rounded-pill'>未付款</span>
                  )}
                <h3 className="mt-4">配送地址：</h3>
                <p>{orderData.user?.address}</p>
                <p className="fw-bold mb-5">預計送達時間：3-5 工作日内</p>
                <p>
                  非常感謝您選擇我們的產品。您的訂單正在處理中，我們將盡快將它送上您的手中。<br />
                  您對品質的信任是我們最大的動力，我們承諾將為您提供最優質的服務和產品。<br />
                  我們期待您在收到產品時的喜悅，並希望它能為您的生活增添更多的色彩。<br/><br/>
                  如果您有任何問題或需要進一步的協助，請隨時聯繫我們的客服團隊。<br/>
                  再次感謝，並期待您的再次光臨！祝您有美好的一天！
                </p>
                <p>
                  如果您有任何問题，請隨時
                  <Link 
                    to="/contact-us" 
                    className="mx-2 text-info fw-bold text-decoration-underline"
                  >
                    聯絡我們
                  </Link>。
                </p>
                <Link to="/" className="btn btn-outline-dark me-2 rounded-0 mb-4">
                  回到首頁
                </Link>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card rounded-0 py-4">
                  <div className="card-header border-bottom-0 bg-white px-4 py-0">
                    <h3>訂單內容：</h3>
                  </div>
                  <div className="card-body px-4 py-0">
                    <ul className="list-group list-group-flush">
                      {Object.values(orderData?.products || {}).map((item) => {
                        return (
                          <li className="list-group-item px-0" key={item.id}>
                            <div className="d-flex mt-2">
                              <img 
                                src={item.product.imageUrl} 
                                alt="" 
                                className="me-2" 
                                style={{width: '60px', height: '60px', objectFit: 'cover'}} 
                              />
                              <div className="w-100 d-flex flex-column">
                                <div className="d-flex justify-content-between fw-bold">
                                  <h5>{item.product.title}</h5>
                                  <p className="mb-0">x{item.qty}</p>
                                </div>
                                <div className="d-flex justify-content-between mt-auto">
                                  <p className="text-muted mb-0"><small>NT${item.product.price}</small></p>
                                  <p className="mb-0">NT${item.final_total}</p>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                      <li className="list-group-item px-0 pb-0">
                        <table className="table text-muted">
                          <tbody>
                            <tr>
                              <th scope="row" className="border-0 px-0 font-weight-normal">小計</th>
                              <td className="text-end border-0 px-0">NT$ {orderData.total}</td>
                            </tr>
                            <tr>
                              <th scope="row" className="border-0 px-0 pt-0 font-weight-normal">付款方式</th>
                              <td className="text-end border-0 px-0 pt-0">
                                {paymentMethod === 'cashOnDelivery' ? '貨到付款' : 'PayPal'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-between mt-2">
                          <p className="mb-0 h4 fw-bold">總金額</p>
                          <p className="mb-0 h4 fw-bold">NT$ {orderData.total}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSuccess;