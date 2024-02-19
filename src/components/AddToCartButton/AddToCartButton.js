import axios from 'axios';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";


const AddToCartButton = ({ productItem }) => {
  const { getCart } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isProductInCart, setIsProductInCart] = useState(false);

  const addToCart = async() => {
    const data = {
      "data": {
        "product_id": productItem.id,
        "qty": 1,
      },
    };
    setIsLoading(true);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
        data,
      );
      dispatch(createAsyncMessage(res.data)); 
      getCart(); 
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data)); 
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    setIsProductInCart(true);
    addToCart();
  };

  return (
    <button 
      onClick={handleAddToCart} 
      disabled={isLoading}
      className="btn AddToCartButton"
    >
      {isProductInCart ? (
        <i className="bi bi-bag-check-fill"></i>
      ) : (
        <i className="bi bi-bag-fill"></i>
      )}
    </button>
  );
};

export default AddToCartButton;
