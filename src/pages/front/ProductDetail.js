import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from "react-redux"; // 用於 吐司元件 
import { createAsyncMessage } from "../../slice/messageSlice"; // 用於 吐司元件

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);
  const { id } = useParams(); // 使用這個鉤子取出ID，這個id是在先前使用動態路由取得的path="product/:id"
  const { getCart } = useOutletContext();
  const dispatch = useDispatch();

  // 取得單一產品
  const getProduct = async (id) => {
    const productRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
      console.log(productRes);
      setProduct(productRes.data.product);
  };


  const addToCart = async() => {
    const data = {
      "data": {
        "product_id": product.id,
        "qty": cartQuantity,
      },
    };
    setIsLoading(true);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
        data,
      );
      console.log(res);
      dispatch(createAsyncMessage(res.data)); 
      getCart(); 
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data)); 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  useEffect(() => {
    // 如果有有效的「其他圖片」，則過濾掉空值，避免出現空白圖片。
    const otherImages = product.imagesUrl?.filter(url => url) || [];
    // 主圖片如果存在，則將其放在輪播圖片的第一位
    const updatedCarouselImages = product.imageUrl ? [product.imageUrl, ...otherImages] : otherImages;

    setCarouselImages(updatedCarouselImages);
  }, [product]);

  return (
    <>
      <div className="container my-5 mt-10">
        <div className="row">
          {/* 產品圖片輪播 */}
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            {carouselImages.length > 0 && (
                <div id="productCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
                  <div className="carousel-indicators">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#productCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : ""}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner">
                    {carouselImages.map((imageUrl, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <img 
                          src={imageUrl} 
                          className="d-block w-100 object-cover ProductDetail-carousel" 
                          alt={`${product.title} view ${index + 1}`} 
                          />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev d-none d-lg-block" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next d-none d-lg-block" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
          </div>
          {/* 產品顏色尺寸選擇 */}
          <div className="col-12 col-lg-6">
            <h1 className="display-5 fw-bold">購買 {product.title}</h1>
            <p className="lead">NT$ {product.price}</p>

            <div className="row">
      <div className="col">
        <div className="mt-4">
          <h2 className="h5">選擇顏色</h2>
          <div className="d-flex">
            <div className="color-select mx-1">
              <button 
                className={`btn p-3 ${selectedColor === 'light' ? 'border border-2 border-dark btn-light' : 'btn-light'}`}
                onClick={() => setSelectedColor('light')}
              ></button>
            </div>
            <div className="color-select mx-1">
              <button 
                className={`btn p-3 ${selectedColor === 'dark' ? 'border border-2 border-dark btn-dark' : 'btn-dark'}`}
                onClick={() => setSelectedColor('dark')}
              ></button>
            </div>
            {/* 更多顏色 */}
          </div>
        </div>
      </div>
      <div className="col">
        <div className="mt-4">
          <h2 className="h5">選擇儲存容量</h2>
          <div className="d-flex">
            <button 
              className={`btn mx-1 ${selectedCapacity === '128GB' ? 'border border-2 border-dark btn-outline-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCapacity('128GB')}
            >
              128GB
            </button>
            <button 
              className={`btn mx-1 ${selectedCapacity === '256GB' ? 'border border-2 border-dark btn-outline-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCapacity('256GB')}
            >
              256GB
            </button>
            {/* 更多容量 */}
          </div>
        </div>
      </div>
    </div>
            <div className="mt-4">
              <h2 className="h5">是否有 Wi-Fi + Cellular</h2>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="connectivity" id="wifi" />
                <label className="form-check-label" htmlFor="wifi">
                  Wi-Fi
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="connectivity" id="wifiCellular" />
                <label className="form-check-label" htmlFor="wifiCellular">
                  Wi-Fi + Cellular
                </label>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-6">
                <div className="input-group mb-3 border border-primary rounded-4 mt-3 w-100">
                  <div className="input-group-prepend">
                    <button 
                      className="btn btn-outline-dark rounded-4 border-0 py-3 px-md-4" 
                      type="button" 
                      id="button-addon1"
                      onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                  </div>
                  <input 
                    type="number" 
                    className="form-control border-0 text-center my-auto shadow-none flex-grow-1" 
                    placeholder="" 
                    aria-label="Example text with button addon" 
                    aria-describedby="button-addon1"
                    value={cartQuantity}
                    readOnly
                  />
                  <div className="input-group-append">
                    <button 
                      className="btn btn-outline-dark rounded-4 border-0 py-3 px-md-4" 
                      type="button" 
                      id="button-addon2"
                      onClick={() => setCartQuantity((pre) => pre + 1)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-6 d-none d-lg-block"></div>
              <div className="col-12 col-md-6">
                <button 
                  type="button"
                  className="btn btn-dark w-100 rounded-4 py-3"
                  onClick={() => addToCart()}
                  disabled={isLoading}
                >
                  加入購物車
                </button>
              </div>
            </div>
            
          </div>
        </div>
        <div className="row">
          {/* 產品詳細介紹與說明 */}
          <div className="col-12 col-md-6 order-lg-2">
            <div className="accordion border-0 mt-3 mb-3" id="accordionExample">
                <div className="card border-0 rounded-4">
                  <div className="card-header py-4 bg-white border-0 rounded-4" id="headingOne" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                    <div className="d-flex justify-content-between align-items-center pe-1">
                      <h4 className="mb-0">
                        介紹
                      </h4>
                      <i className="bi bi-chevron-down"></i>
                    </div>
                  </div>
                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="card-body pb-5">
                      {product.description}
                    </div>
                  </div>
                </div>
                <div className="card border-0 rounded-4" >
                  <div className="card-header py-4 bg-white border-0 border-top rounded-4 " id="headingTwo" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                    <div className="d-flex justify-content-between align-items-center pe-1">
                      <h4 className="mb-0">
                      說明
                      </h4>
                      <i className="bi bi-chevron-down"></i>
                    </div>
                  </div>
                  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="card-body pb-5">
                      {product.content}
                    </div>
                  </div>
                </div>
              </div>
          </div>
          {/* 所有圖片 */}
          <div className="col-12 col-md-6 order-lg-1">
            <div className="">
              {product.imagesUrl && product.imagesUrl.map((imageUrl, index) => 
                imageUrl && <img key={index} src={imageUrl} alt={`${product.title} view ${index + 1}`} className="img-fluid mt-3 rounded-4" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail;