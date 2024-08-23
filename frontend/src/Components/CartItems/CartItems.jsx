import React, { useContext, useEffect, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import 'react-phone-input-2/lib/style.css';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, createOrder, updateCartItemQuantity } = useContext(ShopContext);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [village, setVillage] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [guestName, setGuestName] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [cityId, setCityId] = useState();
    const [areaId, setAreaId] = useState();
    const [shippingFee, setShippingFee] = useState(null);
    const [totalShipmentAmount, setTotalShipmentAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            console.log(cartItems)
            setLoading(true);
            try {
                const citiesResponse = await fetch('http://localhost:4000/api/cities');
                if (!citiesResponse.ok) {
                    throw new Error(`Failed to fetch cities. Status: ${citiesResponse.status}`);
                }
                const citiesData = await citiesResponse.json();
                setCities(citiesData);

                const feesResponse = await fetch('http://localhost:4000/api/fees');
                if (!feesResponse.ok) {
                    throw new Error(`Failed to fetch shipping fees. Status: ${feesResponse.status}`);
                }
                const feesData = await feesResponse.json();
                const foundFee = feesData.find(f => f.ToCity === city);
                if (foundFee) {
                    setShippingFee(foundFee.Fees);
                } else {
                    throw new Error(`Shipping fee not found for city: ${city}`);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [city]);

    useEffect(() => {
        const calculateTotalShipmentAmount = () => {
            const totalAmount = getTotalCartAmount() + (shippingFee || 0);
            setTotalShipmentAmount(totalAmount);
        };

        calculateTotalShipmentAmount();
    }, [getTotalCartAmount, shippingFee]);

    const fetchAreas = async (cityId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/areas?cityId=${cityId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setAreas(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        const selectedCity = cities.find(city => city.ArabicCityName === selectedCityId);
        setCity(selectedCityId);
        setCityId(selectedCity.Id);
        fetchAreas(selectedCity.Id);
    };
    const handlePhoneNumberChange = (e) => {
        let value = e.target.value;  // احصل على القيمة من الحقل المدخل مباشرة
    
        // تأكد أن القيمة سلسلة نصية وأن replace يمكن تطبيقها
        if (typeof value === 'string') {
            const cleanedValue = value.replace(/\D/g, ''); // إزالة الأحرف غير الرقمية
    
            // قيد الرقم إلى 10 أرقام فقط
            if (cleanedValue.length <= 10) {
                setPhoneNumber(cleanedValue);
            }
        } else {
            console.error("Unexpected value type:", typeof value); // سجل نوع القيمة غير المتوقعة
        }
    };
    
    
    
    const handleAreaChange = (e) => {
        const selectedAreaId = e.target.value;
        const selectedArea = areas.find(area => area.AreaName === selectedAreaId);
        setVillage(selectedAreaId);
        setAreaId(selectedArea.Id);
    };

    const handleQuantityChange = (itemId, size, delta) => {
        updateCartItemQuantity(itemId, size, delta);
    };

    const handleOrder = async () => {
        if (country.trim() === '' || city.trim() === '' || neighborhood.trim() === '' || phoneNumber.trim() === '') {
            alert('Please fill in the required address fields.');
            return;
        }

        const address = `${country}, ${city}, ${village}, ${neighborhood}`

        try {
            const response = await createOrder(address, guestName, cityId, areaId, phoneNumber, totalShipmentAmount);
            if (response.success) {
                alert("Order created successfully");
            } else {
                setAlertMessage(response.message);
            }
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div className='cartitems'>
            {alertMessage && (
                <div className="alert alert-danger">
                    {alertMessage}
                </div>
            )}
            <div className="cartitems-format-main">
                <p>المنتجات</p>
                <p>الاسم</p>
                <p>السعر</p>
                <p>الحجم</p>
                <p>الكمية</p>
                <p>المجموع</p>
                <p>ازالة</p>
            </div>
            <hr />
            {Object.keys(cartItems).map((itemId) => {
                return Object.keys(cartItems[itemId]).map((size) => {
                    const product = all_product.find((p) => p._id === itemId);
                    if (product) {
                        const quantity = cartItems[itemId][size];
                        return (
                            <div key={`${itemId}-${size}`}>
                                <div className="cartitems-format cartitems-format-main">
                                    <img src={product.image} alt="" className='carticon-product-icon' />
                                    <p>{product.name}</p>
                                    <p>${product.price}</p>
                                    <p>{size}</p>
                                    <div className='cartitems-quantity'>
                                        <button 
                                            onClick={() => handleQuantityChange(itemId, size, -1)} 
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(itemId, size, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p>${product.price * quantity}</p>
                                    <img 
                                        className='cartitems-remove-icon' 
                                        src={remove_icon} 
                                        onClick={() => { removeFromCart(itemId, size) }} 
                                        alt="" 
                                    />
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                });
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>مجموع السلة</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>المجموع النهائي</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>رسوم الشحن</p>
                            <p>${shippingFee || 0}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>المجموع</h3>
                            <h3>${totalShipmentAmount}</h3>
                        </div>
                    </div>
                    <div className="cartitems-address">
                        <h3>العنوان</h3>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="اسم الدولة"
                            required
                        />
                        <select
                            value={city}
                            onChange={handleCityChange}
                            required
                        >
                            <option value="">اختر المدينة</option>
                            {cities.map(city => (
                                <option key={city.Id} value={city.ArabicCityName}>{city.ArabicCityName}</option>
                            ))}
                        </select>
                        <select
                            value={village}
                            onChange={handleAreaChange}
                            required
                        >
                            <option value="">اختر المنطقة</option>
                            {areas.map(area => (
                                <option key={area.Id} value={area.AreaName}>{area.AreaName}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder="اسم الحي"
                            required
                        />
                        <input
    type="text"  // تأكد أن النوع هو نصي
    value={phoneNumber}
    onChange={handlePhoneNumberChange}
    placeholder="ادخل فقط 10 أرقام"
    required
/>

                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="الرجاء كتابة الاسم الذي ستسجل به الطلبية"
                        />
                    </div>
                    <button onClick={handleOrder} className="btn btn-primary">تاكيد الطلب</button>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
