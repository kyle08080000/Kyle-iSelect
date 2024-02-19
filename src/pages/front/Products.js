import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import CategoryFilter from "../../components/CategoryFilter";
import { LoaderPulseLoader } from "../../components/Loaders/ReactSpinners";

function Products () {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部'); // 新增狀態追蹤所選分類

  // 取得產品列表
  const getProducts = async (page = 1, category = '') => {
    setLoading(true);
    const url = `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}` + (category && category !== '全部' ? `&category=${category}` : '');
    const productRes = await axios.get(url);
    console.log(productRes);
    setProducts(productRes.data.products);
    setPagination(productRes.data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    getProducts(1, selectedCategory);
  }, [selectedCategory]); 
  // 處理分類選擇
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="container mt-10 mb-3" >
        <CategoryFilter onCategoryChange={handleSelectCategory} />
        <div className="row g-2">
          {isLoading ? <LoaderPulseLoader /> : products.map((product) => (
            <div className="col-6 col-sm-4 col-lg-3 mb-3" key={product.id}>
              <div className="text-center position-relative">
                <AddToCartButton productItem={product} />
                <Link to={`/product/${product.id}`} className="d-block">
                  <img 
                    src={product.imageUrl} 
                    className="product-img card-img-top rounded-4 object-cover"
                    height={265} 
                    alt={product.title} 
                  />
                </Link>
                <div className="card-body p-0">
                  <h4 className="mb-0 mt-2">
                    <Link to={`/product/${product.id}`} style={{fontSize: '14.5px'}}>{product.title}</Link>
                  </h4>
                  <p className="text-info fw-bold my-1" style={{fontSize: '12px'}}>
                    NT$ {product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <nav className="mt-5 d-flex justify-content-center">
          <Pagination 
            pagination={pagination}
            changePage={(page) => getProducts(page, selectedCategory)} // 傳遞所選分類到 getProducts 函數
          />
        </nav>
      </div>
    </>
  )
}

export default Products;
