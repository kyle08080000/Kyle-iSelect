import React, { useState } from 'react';

const ColorSelector = ({ productImages, colorButtons }) => {
  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  const handleColorClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="color-selector">
      <img src={selectedImage} alt="Product" className="product-image" />
      <div className="color-buttons">
        {colorButtons.map((button, index) => (
          <button
            key={index}
            style={{ 
              backgroundImage: `url(${button.imageSrc})`,
              zIndex: '100'
            }}
            onClick={() => handleColorClick(productImages[index])}
            className="color-button"
          >213</button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
