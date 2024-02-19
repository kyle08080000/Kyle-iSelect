import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CouponsModal from "../../components/CouponsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import { LoaderThreeDots } from "../../components/Loaders/LoaderSpinner";

function AdminCoupons () {
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]); // 
  const [pagination, setPagination] = useState({}); // 分頁功能要使用
  
  // type: 決定 modal 展開的用途
  const [type, setType] = useState('create'); // 預設 modal 為展開新增商品使用，傳入是 edit 的話則是編輯
  const [tempCoupon, setTempCoupon] = useState({});
  
  // 啟用 bs5視窗模組
  const couponModal = useRef(null);
  const deleteModal = useRef(null);
  
  useEffect(() => {
    // 彈出視窗
    couponModal.current = new Modal('#productModal', {
      backdrop: 'static',
    });
    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
    });
    
    getCoupons();
  }, []);

  // 取得優惠卷列表
  const getCoupons = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`);
      console.log(res);
      setCoupons(res.data.coupons);
      setPagination(res.data.pagination); // 分頁功能要使用
    } catch (error) {
      console.log("取得優惠卷列表失敗：", error);
    } finally {
      setIsLoading(false); // 結束加載，無論成功或失敗
    };
  }
  
  // 在開啟時就 判斷 要做什麼事。「建立新商品、編輯」按鈕使用
  const openCouponModal = (type, item) => {
    setType(type);
    setTempCoupon(item);
    couponModal.current.show();
  };
  const closeModal = () => {
    couponModal.current.hide();
  };

  // 「刪除」按鈕使用
  const openDeleteModal = (product) => {
    setTempCoupon(product);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  // 刪除功能 實作
  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`);
      if (res.data.success) { // 後端回傳 success: true 的時候
        getCoupons(); // 重新取得優惠卷資料
        deleteModal.current.hide(); // 關閉刪除視窗
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="p-3">
      <CouponsModal 
        closeModal={closeModal} 
        getCoupons={getCoupons}
        tempCoupon={tempCoupon}
        type={type}
      />
      <DeleteModal 
        closeDeleteModal={closeDeleteModal}
        text={tempCoupon.title}
        handleDelete={deleteCoupon}
        id={tempCoupon.id}
        itemType="coupon"
      />
      <h3>優惠卷列表</h3>
      <hr />
      <div className="text-end mb-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openCouponModal('create', {})}
        >
          建立新優惠卷
        </button>
      </div>
      <div className="table-responsive text-nowrap" >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">標題</th>
              <th scope="col">折扣</th>
              <th scope="col">到期日</th>
              <th scope="col">優惠碼</th>
              <th scope="col">啟用狀態</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="10"> {/* 10列 */}
                    <LoaderThreeDots />
                  </td>
                </tr>
              ) : coupons.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.percent}</td>
                  <td>{new Date(product.due_date).toDateString()}</td>
                  <td>{product.code}</td>
                  <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => openCouponModal('edit', product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(product)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination 
        pagination={pagination}
        changePage={getCoupons}
      />
    </div>
  )
}

export default AdminCoupons;