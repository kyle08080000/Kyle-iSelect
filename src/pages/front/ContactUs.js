import { useState } from 'react';
import { useForm } from 'react-hook-form';


function ContactUs() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange'  // 設置為 onChange 模式來實現輸入欄位改變時進行驗證
  });

  const onSubmit = data => {
    console.log(data);
    reset(); // 如果你想要在提交後重置表單
  };

  return (
    <div className="container mt-10 mt-md-14 mb-5">
      <div className="row ">
        <div className="col-md-6">
          <h2 className="h1 mb-4 text-center">聯絡我們</h2>
          <p>
            親愛的顧客，歡迎您與我們聯絡。不論您有任何問題、建議，或是想要更了解我們的產品與服務，我們隨時歡迎您的來信。
            我們承諾，您的每一個反饋都是我們進步的動力，您的每一個疑問都將獲得我們迅速且誠摯的回應。
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">姓名*</label>
              <input 
                type="text" 
                className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                id="name" 
                {...register('name', { required: '姓名是必填項目' })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email*</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                id="email" 
                {...register('email', {
                  required: 'Email 是必填項目',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '請輸入有效的 Email 地址',
                  },
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言*</label>
              <textarea 
                className={`form-control ${errors.message ? 'is-invalid' : ''}`} 
                id="message" 
                rows="3"
                {...register('message', { required: '留言是必填項目' })}
              ></textarea>
              {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary mt-3 mt-md-5 py-3 w-100 rounded-0"
            >
              送出
            </button>
          </form>
        </div>
        <div className="col-md-6 position-relative d-flex align-items-center">
          <div className="contact-info mt-5 ms-lg-5 p-4 bg-dark text-white w-100">
            <h2>info</h2>
            <p className="h5 my-5"><i className="me-3 bi bi-envelope-fill"></i> info@getintouch.we</p>
            <p className="h5 my-5"><i className="me-3 bi bi-telephone-fill"></i> +24 56 89 146</p>
            <p className="h5 my-5"><i className="me-3 bi bi-geo-alt-fill"></i> 14 Greenroad St.</p>
            <p className="h5 my-5"><i className="me-3 bi bi-clock-fill"></i> 09:00 - 18:00</p>
          </div>
        </div>
      </div>
      <div className="contact-box d-none"></div>
    </div>
  );
}

export default ContactUs;