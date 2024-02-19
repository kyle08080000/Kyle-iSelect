import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore";
import { LoaderGrid } from "./Loaders/LoaderSpinner";



function ProductModal ({ closeProductModal, getProducts, type, tempProduct }) {
  const [tempData, setTempData] = useState({
    "title": "",
    "category": "",
    "origin_price": 100,
    "price": 300,
    "unit": "",
    "description": "",
    "content": "",
    "is_enabled": 1,
    "imageUrl": "",
    "imagesUrl": [],
  });

  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [isMainImageLoading ,setIsMainImageLoading] = useState(false);
  const [isOtherImagesLoading ,setIsOtherImagesLoading] = useState(false);
  const [message, dispatch] = useContext(MessageContext);
  const fileInputRef = useRef(null);
  const multipleFilesInputRef = useRef(null);

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        "title": "",
        "category": "",
        "origin_price": 0,
        "price": 0,
        "unit": "",
        "description": "",
        "content": "",
        "is_enabled": 1,
        "imageUrl": "",
        "imagesUrl": [],
      });
    } else if (type === 'edit' && tempProduct) {
      // 確保 imagesUrl 是一個陣列
      const imagesUrl = Array.isArray(tempProduct.imagesUrl) ? tempProduct.imagesUrl : [];
      setTempData({ ...tempProduct, imagesUrl });
    }
  }, [type, tempProduct]);

  // 處理新增圖片網址欄位
  const addImageUrlInput = () => {
    const newImagesUrls = [...tempData.imagesUrl, ''];
    setTempData({ ...tempData, imagesUrl: newImagesUrls });
  };
  // 更新特定索引的圖片網址
  const handleImageUrlChange = (index, event) => {
    const newImagesUrls = [...tempData.imagesUrl];
    newImagesUrls[index] = event.target.value;
    setTempData({ ...tempData, imagesUrl: newImagesUrls });
  };


  const handleChange = (e) => {
    const { value, name } = e.target;
  
    if (['price', 'origin_price'].includes(name)) {
      // 使用正則表達式來確保只有數字可以被輸入，並且不允許負數或科學記號
      if (/^\d*\.?\d*$/.test(value)) {
        setTempData({
          ...tempData,
          [name]: Number(value),
        });
      }
    } else if (name === 'is_enabled') {
      setTempData({
        ...tempData,
        [name]: +e.target.checked, // boolean to 1 or 0
      });
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };
  

  // 在圖片上傳後，使用這個函數清除本地預覽的URL
  const clearUploadPreview = () => {
    setUploadPreviewUrl("");
  }

  // 主要圖檔上傳
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // 檢查檔案類型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('檔案類型必須是 JPG、JPEG 或 PNG');
      return;
    }
  
    // 檢查檔案大小（3MB）
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('檔案大小不能超過 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      // 更新上傳圖片預覽 URL
      setUploadPreviewUrl(loadEvent.target.result);
    };
    reader.readAsDataURL(file); // 讀取文件為 Data URL
  
    // 創建 FormData 並添加檔案
    const formData = new FormData();
    formData.append('file-to-upload', file);

    setIsMainImageLoading(true); // 開始加載主圖片
  
    try {
      const response = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData);
      
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      // 從響應中獲取上傳後的圖片 URL 並更新狀態
      if (response.data.imageUrl) {
        setTempData({ ...tempData, imageUrl: response.data.imageUrl });
        clearUploadPreview(); // 上傳成功後清除本地預覽
      }
    } catch (error) {
      console.error('上傳圖片失敗', error);
      // 處理上傳失敗
    } finally {
      setIsMainImageLoading(false); // 無論成功或失敗，結束上傳時設置加載狀態為 false
    }
  };

  // 多個圖檔上傳
  const handleMultipleFilesChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
  
    // 用于保存上传成功的图片URL
    const uploadedImagesUrls = [];
  
    // 遍历选中的文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 检查文件类型和大小等
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('文件类型必须是 JPG、JPEG 或 PNG');
        continue; // 跳过当前文件
      }
      if (file.size > 3 * 1024 * 1024) {
        alert('文件大小不能超过 3MB');
        continue; // 跳过当前文件
      }

      setIsOtherImagesLoading(true); // 開始加載其他圖片
  
      try {
        // 创建FormData并添加文件
        const formData = new FormData();
        formData.append('file-to-upload', file);
  
        // 发送请求到上传API
        const response = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData);
        
        // 保存上传后的图片URL
        if (response.data.imageUrl) {
          uploadedImagesUrls.push(response.data.imageUrl);
        }
      } catch (error) {
        console.error(`上传文件 ${file.name} 失败`, error);
      } finally {
        setIsOtherImagesLoading(false); // 無論成功或失敗，結束上傳時設置加載狀態為 false
      }
    }
  
    // 更新tempData状态，添加新上传的图片URL
    setTempData({ ...tempData, imagesUrl: [...tempData.imagesUrl, ...uploadedImagesUrls] });
  };
  

  const submit = async () => {
    try {
      // api 預設新增商品
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method = 'post';

      // 符合條件的話 更改為 編輯商品
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`
        method = 'put';
      }

      const res = await axios[method](
        api , {
          data: tempData
        }
      );
      console.log(res);
      handleSuccessMessage(dispatch, res); // 成功訊息已被重構到 messageStore.js
      handleCloseAndClear(); // 關閉視窗
      getProducts(); // 取得遠端資料
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error); // 失敗訊息已被重構到 messageStore.js
    }
  }
  
  // 處理模態框關閉清除圖片檔案
  const handleCloseAndClear = () => {
    // 清空檔案輸入
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 清空“上传更多图片”的文件输入
    if (multipleFilesInputRef.current) {
        multipleFilesInputRef.current.value = "";
    }

    // 清空上傳預覽URL
    setUploadPreviewUrl("");

    // 調用傳入的 closeProductModal 函式來關閉模態框
    closeProductModal();
  };


  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id="productModal"
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-xl'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              { type === 'create' ? '建立新商品' : `編輯 ${tempData.title}` }
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={handleCloseAndClear}
            />
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className="col-sm-3">
                <div className='form-group mb-2'>
                  <h4>新增主圖片</h4>
                  <label className='w-100 mb-1' htmlFor='image'>
                    輸入主圖片網址
                    <input
                      type='text'
                      name='imageUrl'
                      id='image'
                      placeholder='請輸入圖片連結'
                      className='form-control'
                      value={tempData.imageUrl}
                      onChange={handleChange}
                    />
                  </label>
                  <div className='form-group mb-3'>
                    <label className='w-100' htmlFor='customFile'>
                      或 上傳主圖片
                      <input
                        type='file'
                        name="file-to-upload"
                        id='customFile'
                        className='form-control'
                        onChange={handleFileChange} // 添加處理函數
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  <h4 className="mt-5">新增其他圖片</h4>
                  {tempData.imagesUrl && tempData.imagesUrl.map((url, index) => ( // 确保这里使用 tempData.imagesUrl
                    <div key={index} className='mb-2'>
                      <label htmlFor={`image-url-${index}`} className='form-label'>圖片網址 #{index + 1}</label>
                      <input
                        type='text'
                        className='form-control'
                        id={`image-url-${index}`}
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e)}
                        placeholder='請输入圖片網址'
                      />
                    </div>
                  ))}
                  <button type='button' className='btn btn-info mt-2' onClick={addImageUrlInput}>新增其他圖片網址</button>
                </div>
                
                <div className='form-group my-3'>
                  <label htmlFor='imagesUrl' className='form-label'>上傳更多圖片</label>
                  <input
                    type='file'
                    className='form-control'
                    id='imagesUrl'
                    multiple
                    onChange={handleMultipleFilesChange}
                    ref={multipleFilesInputRef} // 使用 ref
                  />
                  
                </div>
                <span className="d-block mt-2 text-muted">
                  請注意，僅限使用 jpg、jpeg 與 png 格式，檔案大小限制為 3MB 以下。
                </span>
              </div>
              <div className='col-sm-3'>
                <div className='mb-3'>
                  {/* 預覽主圖片 */}
                  <span className="d-block">主圖片預覽</span>
                  {isMainImageLoading ? ( // 假設您有一個狀態來追踪主圖片加載情況
                    <LoaderGrid />
                  ) : (
                    <img src={tempData.imageUrl || uploadPreviewUrl} alt="preview" className="img-fluid img-thumbnail" />
                  )}
                  
                  {/* 預覽其他圖片 */}
                  <div className='mt-2'>
                    <span className="d-block">其他圖片預覽</span>
                    {isOtherImagesLoading ? ( // 假設您有一個狀態來追踪其他圖片的加載情況
                      <LoaderGrid />
                    ) : (
                      tempData.imagesUrl && tempData.imagesUrl.map((url, index) => (
                        <img key={index} src={url} alt={`preview ${index}`} className="img-thumbnail" style={{ maxWidth: '120px', marginRight: '5px' }} />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className='col-sm-6'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='title'>
                    標題
                    <input
                      type='text'
                      id='title'
                      name='title'
                      placeholder='請輸入標題'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='category'>
                      分類
                      <input
                        type='text'
                        id='category'
                        name='category'
                        placeholder='請輸入分類'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.category}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='unit'>
                      單位
                      <input
                        type='unit'
                        id='unit'
                        name='unit'
                        placeholder='請輸入單位'
                        className='form-control'
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='origin_price'>
                      原價
                      <input
                        type='number'
                        id='origin_price'
                        name='origin_price'
                        placeholder='請輸入原價'
                        className='form-control'
                        min="0"
                        onChange={handleChange}
                        value={tempData.origin_price}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='price'>
                      售價
                      <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='請輸入售價'
                        className='form-control'
                        min="0"
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='description'>
                    產品描述
                    <textarea
                      type='text'
                      id='description'
                      name='description'
                      placeholder='請輸入產品描述'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.description}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='content'>
                    說明內容
                    <textarea
                      type='text'
                      id='content'
                      name='content'
                      placeholder='請輸入產品說明內容'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.content}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='w-100 form-check-label'
                      htmlFor='is_enabled'
                    >
                      是否上架
                      <input
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled'
                        placeholder='請輸入產品說明內容'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={!!tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' onClick={handleCloseAndClear} className='btn btn-secondary'>
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

export default ProductModal;