import { Link, useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../components/FormElements";
import axios from "axios";
import { useEffect, useState } from "react";
import PayPalButton from "../../components/Payment/PayPalButton";
import { LoaderPropagateLoader } from "../../components/Loaders/ReactSpinners";


function Checkout() {
  const { cartData, getCart } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  console.log(cartData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSameAsContact, setIsSameAsContact] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const { couponDiscount } = location.state || {}; // 確保未傳入state時不會出錯
  // 啟用表單
  const {
    register,
    handleSubmit,
    setValue,
    getValues, // 從 useForm 中添加 getValues 函數
    watch,
    formState: { errors }
  } = useForm();

  // 监视联系信息字段的值
  const paymentMethod = watch("paymentMethod"); // PayPal
  const contactInfo = watch(['name', 'tel', 'address']);

  useEffect(() => {
    if (isSameAsContact) {
      // 将联系信息的值设置为运送地址的值
      setValue('shippingName', contactInfo[0]);
      setValue('shippingTel', contactInfo[1]);
      setValue('shippingAddress', contactInfo[2]);
    }
  }, [isSameAsContact, contactInfo, setValue]);
  

  useEffect(() => { // 這個 useEffect 完全由 watch('paymentMethod') 驅動
    setSelectedPaymentMethod(paymentMethod || "cashOnDelivery");
  }, [paymentMethod]);
  

  // 處理支付成功
  const handlePaymentSuccess = async (paymentDetails) => {
    setIsLoading(true);
    const formValues = getValues();
    const { name, email, tel, address} = formValues;
    console.log('formValues',formValues);
    console.log('paymentDetails',paymentDetails);
    // 直接創建一個包含所有必要信息的 data 對象
    const formdata = {
      "data": {
        "user": {
          name, 
          email, 
          tel, 
          address,
        },
        "message": `PayPal 交易ID: ${paymentDetails.id}`,
      }
    };
    // 然後直接調用 onSubmit 並傳遞這個對象
    await onSubmit(formdata, true);
  };


  const onSubmit = async (data, isPaymentSuccess = false) => {
    console.log("被調用時的 isPayPalSuccess:", isPaymentSuccess);
    // 檢查是通過表單提交還是支付完成後調用的
    if (typeof isPaymentSuccess !== 'object' && isPaymentSuccess === true) { // 防止在由 react-hook-form 的 handleSubmit 觸發的 onSubmit 調用中被賦予了 event 對象。變成物件。
      try {
        const Paymentres = await axios.post(
          `/v2/api/${process.env.REACT_APP_API_PATH}/order`,
          data,
        );
        console.log('isPaymentSuccess', Paymentres);

        // 從 Paymentres 中取出 orderId
        const orderId = Paymentres.data.orderId;
        console.log('OrderId:', orderId);

        // 使用 orderId 進行另一個請求
        const PayRes = await axios.post(
          `/v2/api/${process.env.REACT_APP_API_PATH}/pay/${orderId}`,
        );
        console.log('PayRes:', PayRes);
        await getCart(); // 在成功處理支付後更新購物車狀態
        setIsLoading(false);
        // navigate(`/success/${orderId}`);
        navigate(`/success/${orderId}`, { state: { paymentMethod: selectedPaymentMethod } });
      } catch (error) {
        console.error('Payment Submission Failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { name, email, tel, address } = data; // 這些都是從表單id欄位解構出來的資料
        const formData = { // 要送到遠端的資料結構
          "data": {
            "user": {
              name, 
              email, 
              tel, 
              address,
            },
          }
        };

        const res = await axios.post(
          `/v2/api/${process.env.REACT_APP_API_PATH}/order`,
          formData,
        );
        console.log('確認送出的', res);
        await getCart(); // 在成功處理支付後更新購物車狀態
        setIsLoading(false);
        navigate(`/success/${res.data.orderId}`, { state: { paymentMethod: selectedPaymentMethod } });
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
  }

  return(
    <>
      <div className="bg-light mt-6 pt-5 pb-7">
        {isLoading ? <LoaderPropagateLoader /> : (
          <div className="container">
            <div className="row justify-content-center flex-md-row flex-column-reverse">
              <div className="col-md-6">
                <div className="bg-white p-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h4 className="fw-bold">1. 聯絡資料</h4>
                    <div className="bg-white p-4 mb-3">
                      <div className="mb-2">
                        <Input
                          id='email'
                          labelText='Email*'
                          type='email'
                          errors={errors}
                          register={register}
                          rules={{
                            required: 'Email 為必填',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Email 格式不正確',
                            },
                          }}
                        ></Input>
                      </div>
                      <div className="mb-2">
                        <Input
                          id='name'
                          type='text'
                          errors={errors}
                          labelText='姓名*'
                          register={register}
                          rules={{
                            required: '使用者名稱為必填',
                            maxLength: {
                              value: 10,
                              message: '使用者名稱長度不超過 10',
                            },
                          }}
                        ></Input>
                      </div>
                      <div className="mb-2">
                      <Input
                          id='tel'
                          labelText='電話*'
                          type='tel'
                          errors={errors}
                          register={register}
                          rules={{
                            required: '電話為必填',
                            minLength: {
                              value: 6,
                              message: '電話不少於 6 碼'
                            },
                            maxLength: {
                              value: 12,
                              message: '電話不超過 12 碼'
                            }
                          }}
                        ></Input>
                      </div>
                      <div className='mb-3'>
                        <Input
                          id='address'
                          labelText='地址*'
                          type='address'
                          errors={errors}
                          register={register}
                          rules={{
                            required: '地址為必填',
                          }}
                        ></Input>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={isSameAsContact}
                            onChange={e => setIsSameAsContact(e.target.checked)}
                          /> 運送地址同上
                        </label>
                      </div>
                    </div>
                    <h4 className="fw-bold">2. 運送地址</h4>
                    <div className="bg-white p-4 mb-3">
                      <div className="mb-2">
                        <Input
                          id='shippingName'
                          type='text'
                          errors={errors}
                          labelText='收件人姓名*'
                          register={register}
                          rules={{
                            required: '收件人姓名為必填',
                            maxLength: {
                              value: 10,
                              message: '使用者名稱長度不超過 10',
                            },
                          }}
                        ></Input>
                      </div>
                      <div className="mb-2">
                      <Input
                          id='shippingTel'
                          labelText='電話*'
                          type='tel'
                          errors={errors}
                          register={register}
                          rules={{
                            required: '電話為必填',
                            minLength: {
                              value: 6,
                              message: '電話不少於 6 碼'
                            },
                            maxLength: {
                              value: 12,
                              message: '電話不超過 12 碼'
                            }
                          }}
                        ></Input>
                      </div>
                      <div className='mb-3'>
                        <Input
                          id='shippingAddress'
                          labelText='運送地址*'
                          type='address'
                          errors={errors}
                          register={register}
                          rules={{
                            required: '運送地址為必填',
                          }}
                        ></Input>
                      </div>
                      <p className="mt-4 mb-2">付款方式</p>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="paymentMethod" 
                          id="gridRadios1" 
                          value="cashOnDelivery" 
                          {...register("paymentMethod")} // 加入這行來註冊
                          defaultChecked 
                        />
                        <label className="form-check-label text-muted" htmlFor="gridRadios1">
                          貨到付款
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="paymentMethod" 
                          id="gridRadios2" 
                          value="paypal" 
                          {...register("paymentMethod")} // 加入這行來註冊
                        />
                        <label className="form-check-label text-muted" htmlFor="gridRadios2">
                          PayPal
                        </label>
                      </div>
                      {/* 在條件渲染 PayPalButton 的地方使用 paymentMethod 變數 */}
                      {selectedPaymentMethod === 'paypal' && 
                        <div className="w-100">
                          <PayPalButton 
                            onPaymentSuccess={handlePaymentSuccess} 
                            total={cartData.total} 
                          />
                        </div>
                      }
                    </div>
                    <div className="d-flex mt-4 justify-content-between align-items-end w-100">
                      <Link to='/cart' className='text-dark mt-md-0 text-nowrap'>
                        <i className='bi bi-chevron-left me-2'></i> 繼續購物
                      </Link>
                      {selectedPaymentMethod === 'paypal' ? '' :
                        <button
                          type='submit'
                          className='btn btn-dark py-3 px-5 rounded-0 text-nowrap'
                        >
                          確定購買
                        </button>
                      }
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border p-4 mb-4">
                  <h4 className="mb-4">購買品項</h4>
                  { cartData?.carts?.map((item) => {
                    return (
                      <div className="d-flex pb-2" key={item.id}>
                        <img 
                          src={item.product.imageUrl} 
                          alt="" className="me-2" 
                          style={{
                            width: '48px', 
                            height: '48px', 
                            objectFit: 'cover'
                          }} 
                        />
                        <div className="w-100">
                          <div className="d-flex justify-content-between fw-bold">
                            <p className="mb-0">{item.product.title}</p>
                            <p className="mb-0">x{item.qty}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="text-muted mb-0"><small>NT${item.product.price}</small></p>
                            <p className="mb-0">NT${item.final_total}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <table className="table mt-4 border-top border-bottom text-muted">
                    <tbody className="table-light">
                      <tr>
                        <th scope="row" className="border-0 px-0 pt-4 pb-0 font-weight-normal">小計</th>
                        <td className="text-end border-0 px-0 pt-4 pb-0">NT$ {cartData.total}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="border-0 px-0 font-weight-normal">優惠卷折抵:</th>
                        <td className="text-end border-0 px-0">
                          {couponDiscount ? (
                            <span>NT$ -{couponDiscount}</span>
                          ) : (
                            <span>尚未使用</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="border-0 px-0 pt-3 pb-4 font-weight-normal">付款方式</th>
                        <td className="text-end border-0 px-0 pt-3 pb-4">{selectedPaymentMethod === "cashOnDelivery" ? "貨到付款" : "PayPal"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="mb-0 h4 fw-bold">總計</p>
                    <p className="mb-0 h4 fw-bold">NT${cartData.final_total}</p>
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

export default Checkout;
