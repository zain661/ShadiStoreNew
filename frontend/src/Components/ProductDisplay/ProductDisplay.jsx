import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import Alert from '../Alert/Alert.jsx';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setAlertMessage('يرجى اختيار الحجم قبل إضافته إلى السلة.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 3000);
      return;
    }

    const sizeDetails = product.sizes.find(
      (size) => size.size === selectedSize
    );

    if (sizeDetails && sizeDetails.quantity === 0) {
      setAlertMessage(`عذرًا، الكمية غير متوفرة للحجم ${selectedSize}.`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 5000);
      return;
    }

    addToCart(product._id, selectedSize);
    console.log(product.id);
    console.log(selectedSize);
    setAlertMessage('تم اضافة المنتج إلى السلة بنجاح.');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 3000);
  };

  return (
    <div className="productdisplay">
      {showAlert && <Alert message={alertMessage} />}{' '}
      {/* Use the Alert component */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {/* Render additional product images if available */}
          {/* {product.images.map((image, index) => (
            <img key={index} src={image} alt="" />
          ))} */}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-new">
            {product.price} شيكل
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>
        <div className="productdisplay-right-size">
          <h1>اختر الحجم</h1>
          <div className="productdisplay-right-sizes">
            {product.sizes.map((size) => (
              <div
                key={size.size}
                className={`size-option ${
                  selectedSize === size.size ? 'selected' : ''
                }`}
                onClick={() => handleSizeClick(size.size)}
              >
                {size.size}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleAddToCart}>إضافة إلى السلة</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
