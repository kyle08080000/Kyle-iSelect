import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import OrderModal from "../../components/OrderModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import { LoaderThreeDots } from '../../components/Loaders/LoaderSpinner';
import DeleteModal from '../../components/DeleteModal';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempOrder, setTempOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 啟用 bs5視窗模組
  const orderModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    orderModal.current = new Modal('#orderModal', {
      backdrop: 'static',
    });

    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
    });

    getOrders();
  }, []);

  const getOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`,
      );
      console.log(res);
      const validOrders = res.data.orders.filter(order => order.id); // 過濾掉沒有 id
      setOrders(validOrders);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("取得訂單列表失敗:", error);
      // 處理錯誤的邏輯，例如顯示錯誤消息給用戶
    } finally {
      setIsLoading(false); // 無論成功或失敗，結束加載
    }
  };

  // 「刪除」按鈕使用
  const openDeleteModal = (Order) => {
    setTempOrder(Order);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  // 刪除功能 實作
  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/order/${id}`);
      console.log("deleteOrder",res);
      if (res.data.success) { // 後端回傳 success: true 的時候
        getOrders(); // 重新取得資料
        deleteModal.current.hide(); // 關閉刪除視窗
      }
    } catch (error) {
      console.log(error);
    }
  }

  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  }
  const closeOrderModal = () => {
    setTempOrder({});
    orderModal.current.hide();
  }

  return (
    <div className='p-3'>
      <OrderModal
        closeProductModal={closeOrderModal}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <DeleteModal 
        closeDeleteModal={closeDeleteModal}
        text={tempOrder.user?.email}
        handleDelete={deleteOrder}
        id={tempOrder.id}
        itemType="order"
      />
      <h3>訂單列表</h3>
      <hr />
      <div className="table-responsive text-nowrap" >
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>訂單 id</th>
              <th scope='col'>購買用戶</th>
              <th scope='col'>訂單金額</th>
              <th scope='col'>付款狀態</th>
              <th scope='col'>付款日期</th>
              <th scope='col'>留言訊息</th>
              <th scope='col'>編輯</th>
              <th scope='col'>刪除訂單</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="10"> {/* 設置為實際的列數 */}
                    <LoaderThreeDots  />
                  </td>
                </tr>
              ) : orders.map((order) => {
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.user?.email}
                  </td>
                  <td>${order.total}</td>
                  <td>
                    {order.is_paid ? (
                      <span className='text-success fw-bold'>付款完成</span>
                    ) : (
                      '未付款'
                    )}
                  </td>
                  <td>
                    {order.paid_date
                      ? new Date(order.paid_date * 1000).toLocaleString()
                      : '未付款'}
                  </td>
                  <td>{order.message}</td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-primary btn-sm'
                      onClick={() => {
                        openOrderModal(order);
                      }}
                    >
                      查看
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-outline-danger btn-sm'
                      onClick={() => openDeleteModal(order)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination pagination={pagination} changePage={getOrders} />
    </div>
  );
}

export default AdminOrders;