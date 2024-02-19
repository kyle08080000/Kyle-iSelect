import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import { LoaderBarLoader } from '../Loaders/ReactSpinners';

export default function PayPalButton({ onPaymentSuccess, total }) {

  // 定义一个状态变量来控制加载提示的显示与隐藏
  const [isScriptLoading, setIsScriptLoading] = useState(true);

  // PayPalScriptProvider 加载完成后，更新状态以隐藏加载提示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScriptLoading(false);
    }, 3000); // 假设加载时间为3秒，你可以根据实际情况调整

    return () => clearTimeout(timer);
  }, []);

  return (
    <PayPalScriptProvider // PayPalScriptProvider組件負責加載PayPal JavaScript SDK
      options={{ 
        "client-id": "AYXIpfHKYCbKlBxIUpy4kW-JJCarKIZz9UcQrdPAoGH0MGSRPWG_0ESSWM3tageht3AJRWo0F2agIh5i",
        currency: "TWD",
      }}>
      {isScriptLoading ? ( <LoaderBarLoader /> ) : (
        <PayPalButtons // PayPalButtons組件則負責渲染支付按鈕並處理訂單創建和批准的邏輯
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: total, // 總金額
                },
              }],
            });
          }}
          onApprove={(data, actions) => {
            
            return actions.order.capture().then(details => {
              onPaymentSuccess(details);
            });
          }}
        />
      )}
    </PayPalScriptProvider>
  );
}
