import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import { LoaderThreeDots } from "../../components/Loaders/LoaderSpinner";

function AdminProducts () {
  const [products, setProducts] = useState([]); // 
  const [pagination, setPagination] = useState({}); // 分頁功能要使用
  
  // type: 決定 modal 展開的用途
  const [type, setType] = useState('create'); // 預設 modal 為展開新增商品使用，傳入是 edit 的話則是編輯
  const [tempProduct, setTempProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 啟用 bs5視窗模組
  const productModal = useRef(null);
  const deleteModal = useRef(null);
  
  useEffect(() => {
    // 彈出視窗
    productModal.current = new Modal('#productModal', {
      backdrop: 'static',
    });
    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
    });
    
    getProducts();
  }, []);

  // 取得產品列表
  const getProducts = async (page = 1) => {
    try {
      setIsLoading(true); // 開始加載
      const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`);
      console.log(productRes);
      setProducts(productRes.data.products);
      setPagination(productRes.data.pagination); // 設置分頁資料
    } catch (error) {
      console.error("取得產品列表失敗:", error);
      // 處理錯誤的邏輯，例如顯示錯誤消息給用戶
    } finally {
      setIsLoading(false); // 結束加載，無論成功或失敗
    }
  };
  

  // 在開啟時就 判斷 要做什麼事。「建立新商品、編輯」按鈕使用
  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productModal.current.show();
  };
  const closeProductModal = () => {
    productModal.current.hide();
  };

  // 「刪除」按鈕使用
  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  // 刪除功能 實作
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`);
      if (res.data.success) { // 後端回傳 success: true 的時候
        getProducts(); // 重新取得資料
        deleteModal.current.hide(); // 關閉刪除視窗
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="p-3">
      <ProductModal 
        closeProductModal={closeProductModal} 
        getProducts={getProducts}
        tempProduct={tempProduct}
        type={type}
      />
      <DeleteModal 
        closeDeleteModal={closeDeleteModal}
        text={tempProduct.title}
        handleDelete={deleteProduct}
        id={tempProduct.id}
        itemType="product"
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end mb-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openProductModal('create', {})}
        >
          建立新商品
        </button>
      </div>
      <div className="table-responsive text-nowrap" >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">商品圖</th>
              <th scope="col">名稱</th>
              <th scope="col">分類</th>
              <th scope="col">售價</th>
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
              ) : products.map((product) => {
              return (
                <tr key={product.id}>
                  <td>
                    <img src={product.imageUrl} alt={product.title} width={100} className="object-cover"/>
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => openProductModal('edit', product)}
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
        changePage={getProducts}
      />
    </div>
  )
}

export default AdminProducts;