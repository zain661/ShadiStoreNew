import { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/x.png';
import CustomAlert from './CustomAlert'; // تأكد من تعديل مسار الاستيراد حسب الحاجة
import './CustomAlert.css'; // استيراد CSS الخاص بـ CustomAlert

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);

    const fetchInfo = async () => {
        try {
            console.log("Server URL:", process.env.REACT_APP_SERVER_URL);
    
            
            const url = `${process.env.REACT_APP_SERVER_URL}/allproducts`;
            console.log("Fetching from:", url);
    
            const response = await fetch(url);
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    useEffect(() => {
        fetchInfo();
    }, []);

    const remove_product = async (id) => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/removeproduct`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });
        await fetchInfo();
    };

    const handleEditClick = (product) => {
        setEditProduct(product);
        setSelectedFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProduct({ ...editProduct, [name]: value });
    };

    const handleSizeChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSizes = editProduct.sizes.map((size, i) => (
            i === index ? { ...size, [name]: name === 'quantity' ? Number(value) : value } : size
        ));
        setEditProduct({ ...editProduct, sizes: updatedSizes });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
        let imageUrl = editProduct.image;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('product', selectedFile);

            const uploadResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();
            imageUrl = uploadData.image_url;
        }

        const updatedProduct = {
            ...editProduct,
            image: imageUrl,
        };

        await fetch(`${process.env.REACT_APP_SERVER_URL}/updateProduct`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        setEditProduct(null);
        await fetchInfo();
    };

    const handleCancel = () => {
        setEditProduct(null);
        setSelectedFile(null);
    };

    const handleFilterChange = (e) => {
        setFilterCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const handleRemoveClick = (product) => {
        setProductToRemove(product);
        setShowAlert(true);
    };

    const handleConfirmRemove = () => {
        if (productToRemove) {
            remove_product(productToRemove.id);
            setShowAlert(false);
            setProductToRemove(null);
        }
    };

    const handleCancelRemove = () => {
        setShowAlert(false);
        setProductToRemove(null);
    };

    const getFilteredAndSortedProducts = () => {
        let filteredProducts = allproducts;

        if (filterCategory) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category === filterCategory
            );
        }

        if (sortCriteria === 'price-asc') {
            filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortCriteria === 'price-desc') {
            filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortCriteria === 'quantity-asc') {
            filteredProducts = filteredProducts.sort((a, b) => {
                const totalQuantityA = a.sizes.reduce((sum, size) => sum + size.quantity, 0);
                const totalQuantityB = b.sizes.reduce((sum, size) => sum + size.quantity, 0);
                return totalQuantityA - totalQuantityB;
            });
        } else if (sortCriteria === 'quantity-desc') {
            filteredProducts = filteredProducts.sort((a, b) => {
                const totalQuantityA = a.sizes.reduce((sum, size) => sum + size.quantity, 0);
                const totalQuantityB = b.sizes.reduce((sum, size) => sum + size.quantity, 0);
                return totalQuantityB - totalQuantityA;
            });
        }

        return filteredProducts;
    };

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            <div className="filter-sort-container">
                <select value={filterCategory} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="turath">Turath</option>
                    <option value="arek">Arek</option>
                    <option value="jacket">Jacket</option>
                    <option value="girls">Girls</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                    <option value="bride">Bride</option>
                    <option value="fashion">Fashion</option>
                </select>
                <select value={sortCriteria} onChange={handleSortChange}>
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="quantity-asc">Quantity: Low to High</option>
                    <option value="quantity-desc">Quantity: High to Low</option>
                </select>
            </div>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Description</p>
                <p>Price</p>
                <p>Size</p>
                <p>Quantity</p>
                <p>Category</p>
                <p>Remove</p>
                <p>Edit</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {getFilteredAndSortedProducts().map((product, index) => (
                    <div key={index}>
                        {editProduct && editProduct.id === product.id ? (
                            <div className="edit-product-form">
                                <input
                                    type="text"
                                    name="name"
                                    value={editProduct.name || ''}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editProduct.description || ''}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={editProduct.price || ''}
                                    onChange={handleInputChange}
                                />
                                {editProduct.sizes.map((sizeObj, i) => (
                                    <div key={i}>
                                        <input
                                            type="text"
                                            name="size"
                                            value={sizeObj.size || ''}
                                            onChange={(e) => handleSizeChange(e, i)}
                                        />
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={sizeObj.quantity || ''}
                                            onChange={(e) => handleSizeChange(e, i)}
                                        />
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    name="category"
                                    value={editProduct.category || ''}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                />
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div className="listproduct-format-main listproduct-format">
                                <img src={product.image} alt="" className="listproduct-product-icon" />
                                <p>{product.name}</p>
                                <div className="listproduct-description">{product.description}</div>
                                <p>{product.price}</p>
                                <p>{product.sizes.map(s => s.size).join(', ')}</p>
                                <p>{product.sizes.map(s => s.quantity).join(', ')}</p>
                                <p>{product.category}</p>
                                <img
                                    onClick={() => handleRemoveClick(product)}
                                    className='listproduct-remove-icon'
                                    src={cross_icon}
                                    alt=""
                                />
                                <button onClick={() => handleEditClick(product)} className='listproduct-edit-btn'>Edit</button>
                            </div>
                        )}
                        <hr />
                    </div>
                ))}
            </div>
            {showAlert && (
                <CustomAlert
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                    message={`Are you sure you want to remove the product "${productToRemove.name}"?`}
                />
            )}
        </div>
    );
};

export default ListProduct;
