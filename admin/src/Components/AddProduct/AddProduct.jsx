import { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    price: "",
    sizes: [{ size: "", quantity: "" }],
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e, index, field) => {
    if (field) {
      const updatedSizes = [...productDetails.sizes];
      updatedSizes[index][field] = e.target.value;
      if (field === "size" && updatedSizes.some((sizeObj, idx) => sizeObj.size === e.target.value && idx !== index)) {
        alert("This size already exists. Please choose a different size.");
        return;
      }
      setProductDetails({ ...productDetails, sizes: updatedSizes });
    } else {
      if (e.target.name === "price" && isNaN(e.target.value)) {
        alert("Price must be a number.");
        return;
      }
      setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }
  };

  const addSizeField = () => {
    setProductDetails({
      ...productDetails,
      sizes: [...productDetails.sizes, { size: "", quantity: "" }],
    });
  };

  const removeSizeField = (index) => {
    const updatedSizes = productDetails.sizes.filter((_, i) => i !== index);
    setProductDetails({ ...productDetails, sizes: updatedSizes });
  };

  const resetForm = () => {
    setProductDetails({
      name: "",
      description: "",
      image: "",
      category: "",
      price: "",
      sizes: [{ size: "", quantity: "" }],
    });
    setImage(false);
  };

  const Add_Product = async () => {
    if (
      !productDetails.name ||
      !productDetails.description ||
      !productDetails.category ||
      !productDetails.price ||
      productDetails.sizes.some(sizeObj => !sizeObj.size || !sizeObj.quantity) ||
      !image
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (isNaN(productDetails.price)) {
      alert("Price must be a number.");
      return;
    }

    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    try {
      const uploadResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      responseData = await uploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;
        console.log(product);
        const addProductResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/addproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        const addProductData = await addProductResponse.json();

        if (addProductData.success) {
          alert("Product added successfully");
          resetForm();
        } else {
          alert("Failed to add product");
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please check the console for more details.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
          required
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Description</p>
        <textarea
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          placeholder="Type here"
          required
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="text"
            name="price"
            placeholder="Type here"
            className="add-product-selector"
            required
          />
        </div>
      </div>
      <div className="addproduct-category">
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select
            value={productDetails.category}
            onChange={(e) => changeHandler(e)}
            name="category"
            className="add-product-selector"
            required
          >
            <option value="">Select Category</option>
            <option value="turath">turath</option>
            <option value="arek">arek</option>
            <option value="jacket">jacket</option>
            <option value="girls">girls</option>
            <option value="accessories">accessories</option>
            <option value="shoes">shoes</option>
            <option value="bride">bride</option>
            <option value="fashion">fashion</option>
          </select>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Sizes and Quantities</p>
        {productDetails.sizes.map((sizeObj, index) => (
          <div key={index} className="size-quantity-field">
            <select
              value={sizeObj.size}
              onChange={(e) => changeHandler(e, index, "size")}
              name="size"
              className="add-product-selector"
              required
            >
              <option value="">Select Size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="OneSize">One Size</option>
            </select>
            <input
              type="number"
              value={sizeObj.quantity}
              onChange={(e) => changeHandler(e, index, "quantity")}
              placeholder="Quantity"
              className="quantity-input"
              required
            />
            {index > 0 && (
              <button type="button" onClick={() => removeSizeField(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSizeField}
          className="addproduct-more-sizes-btn"
        >
          Add More Sizes
        </button>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
          required
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
