import axios from "axios";
import { useEffect, useState } from "react";

function CouponModal ({ closeModal, getCoupons, type, tempCoupon }) {
  const [tempData, setTempData] = useState({
    "title": "",
    "is_enabled": 1,
    "percent": 80,
    "due_date": 1555459200,
    "code": "testCode"
  });
  const [date, setDate] = useState(new Date());


  useEffect(() => {
    if (type === 'create') {
      setTempData({
        "title": "",
        "is_enabled": 1,
        "percent": 0,
        "due_date": 0,
        "code": ""
      });
      setDate(new Date()); // 使用的是此時此刻的時間
    } else if (type === 'edit') {
      setTempData(tempCoupon);
      setDate(new Date(tempCoupon.due_date)) // 取得的是資料庫裡的 due_date 時間
    }
  }, [type, tempCoupon]);


  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target; // 對折扣數字進行驗證

    if (inputType === 'checkbox') {
      setTempData((prevData) => ({
        ...prevData,
        [name]: checked ? 1 : 0,
      }));
    } else if (inputType === 'number' || name === 'percent') {
      let numberValue = parseInt(value, 10);
      // 限制折扣为100的最大值
      numberValue = numberValue > 100 ? 100 : numberValue;
      setTempData((prevData) => ({
        ...prevData,
        [name]: numberValue,
      }));
    } else {
      setTempData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const submit = async () => {
    try {
      // api 預設新增商品
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method = 'post';

      // 符合條件的話 更改為 編輯商品
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`
        method = 'put';
      }

      const res = await axios[method](
        api , {
          data: {
            ...tempData,
            due_date: date.getTime() // 這段會將new Date格式轉成，unix timestamp格式
          }
        }
      );

      console.log('Submitting data:', {
        data: {
          ...tempData,
          due_date: date.getTime(),
        }
      });
      

      console.log(res);
      closeModal(); // 關閉視窗
      getCoupons(); // 取得遠端資料
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id="productModal"
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              { type === 'create' ? '建立新優惠卷' : `編輯 ${tempData.title}` }
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeModal}
            />
          </div>
          <div className='modal-body'>
            <div className='mb-2'>
              <label className='w-100' htmlFor='title'>
                標題
                <input
                  type='text'
                  id='title'
                  placeholder='請輸入標題'
                  name='title'
                  className='form-control mt-1'
                  value={tempData.title}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='percent'>
                  折扣（%）
                  <input
                    type='text'
                    name='percent'
                    id='percent'
                    placeholder='請輸入折扣（%）'
                    className='form-control mt-1'
                    value={tempData.percent}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='due_date'>
                  到期日
                  <input
                    type='date'
                    id='due_date'
                    name='due_date'
                    placeholder='請輸入到期日'
                    className='form-control mt-1'
                    value={`${date.getFullYear().toString()}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, 0)}-${date
                      .getDate()
                      .toString()
                      .padStart(2, 0)}`}
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                    }}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='code'>
                  優惠碼
                  <input
                    type='text'
                    id='code'
                    name='code'
                    placeholder='請輸入優惠碼'
                    className='form-control mt-1'
                    value={tempData.code}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
            <label className='form-check-label' htmlFor='is_enabled'>
              <input
                className='form-check-input me-2'
                type='checkbox'
                id='is_enabled'
                name='is_enabled'
                checked={!!tempData.is_enabled}
                onChange={handleChange}
              />
              是否啟用
            </label>
          </div>
          <div className='modal-footer'>
            <button type='button' onClick={closeModal} className='btn btn-secondary'>
              關閉
            </button>
            <button type='button' className='btn btn-primary'
              onClick={submit}
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;