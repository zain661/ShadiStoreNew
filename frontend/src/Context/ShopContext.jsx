import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let index = 0; index < 300 + 1; index++) {
//     cart[index] = 0;
//   }
//   return cart;
// };

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : {};
});
  const [all_product, setAll_Product] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
//   useEffect(() => {
//     const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
//     setCartItems(storedCartItems);
// }, []);


  useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}, [cartItems]);
const updateCartItemQuantity = (itemId, size, delta) => {
  // Example logic to update cart item quantity
  setCartItems(prevItems => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId]) {
          if (updatedItems[itemId][size] + delta <= 0) {
              delete updatedItems[itemId][size];
          } else {
              updatedItems[itemId][size] += delta;
          }
      }
      return updatedItems;
  });
};

  const fetchCartItems = async () => {
    console.log("here")
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const response = await fetch("http://localhost:4000/cart", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data)
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } 
    // else {
    //   const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    //   if (storedCartItems) {
    //     setCartItems(storedCartItems);
    //   }
    // }
  };

  const fetchProducts = async () => {
    try {
      console.log("here 2")
      const response = await fetch("http://localhost:4000/allproducts");
      console.log("suha")
      const data = await response.json();
      setAll_Product(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch("http://localhost:4000/allproducts", {
       
  //     });
  //     const data = await response.json();
  //     setAll_Product(data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };
  

  useEffect( ()=> {
    fetchCartItems();
    fetchProducts();
  }, []);

  useEffect(() => {
    const validCartItems = {};
    for (const itemId in cartItems) {
      if (all_product.some((product) => product._id === itemId)) {
        validCartItems[itemId] = cartItems[itemId];
      }
    }
    console.log(validCartItems);
    setCartItems(validCartItems);
  }, [all_product]);

  const addToCart = (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (typeof updatedCart[itemId] === "number") {
          updatedCart[itemId] = {};
      }
      if (!updatedCart[itemId]) {
          updatedCart[itemId] = {};
      }
      if (!updatedCart[itemId][size]) {
          updatedCart[itemId][size] = 0;
      }
      updatedCart[itemId][size] += 1;

      // Save to local storage
      // localStorage.setItem('cartItems', JSON.stringify(updatedCart));

      return updatedCart;
  });
  
    const token = localStorage.getItem("auth-token");
  
    if (token) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, size })
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    }
  };
  
  

  const removeFromCart = async (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] && updatedCart[itemId][size]) {
        updatedCart[itemId][size] -= 1;
        if (updatedCart[itemId][size] <= 0) {
          delete updatedCart[itemId][size];
          if (Object.keys(updatedCart[itemId]).length === 0) {
            delete updatedCart[itemId];
          }
        }
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });

    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const response = await fetch("http://localhost:4000/removefromcart", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, size }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          const cartResponse = await fetch("http://localhost:4000/cart", {
            method: "GET",
            headers: {
              "auth-token": token,
            },
          });

          if (cartResponse.ok) {
            const updatedCart = await cartResponse.json();
            setCartItems(updatedCart);
          } else {
            console.error("Failed to fetch updated cart data");
          }
        } else {
          console.error("Failed to remove item from cart");
          console.log(await response.text()); // Print the response body
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const itemInfo = all_product.find(
            (product) => product._id === (itemId)
          );
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[itemId][size];
          }
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalItem += cartItems[itemId][size];
      }
    }
    return totalItem;
  };

  const createOrder = async (address, guestName, cityId, areaId, phoneNumber, totalShipmentAmount) => {
    const token = localStorage.getItem("auth-token");

    const orderProducts = Object.keys(cartItems)
      .flatMap((itemId) => {
        const product = all_product.find(
          (product) => product._id === (itemId)
        );
        
        if (!product) {
          console.error(`Product not found for itemId: ${itemId}`);
          return [];
        }

        return Object.keys(cartItems[itemId]).map((size) => {
          return {
            productId: product._id,
            size: size,
            quantity: cartItems[itemId][size],
          };
        });
      })
      .filter((item) => item.quantity > 0);

    if (orderProducts.length === 0) {
      console.error("No valid products in the order");
      return;
    }

    const orderData = {
      products: orderProducts,
      totalAmount: totalShipmentAmount,
      address,
      cityId,
      areaId, 
      phoneNumber,
      guestName: guestName || "Guest",
    };

    if (token) {
      orderData.userId = token;
    }

    try {
      const response = await fetch("http://localhost:4000/createorder", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token && { "auth-token": token }), // Add auth-token header only if token exists
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order created successfully:", data);
        alert("Order created successfully");
        setCartItems({}); // Empty the cart after order creation
        return { success: true};
      } else {
        console.error("Failed to create order");
        alert("Failed to create order");
        return { success: false,  };
      }
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (productData) => {
    try {
      const response = await fetch("http://localhost:4000/updateproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product updated successfully:", data);
        fetchProducts();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const contextValue = {
    updateProduct,
    setSelectedProduct,
    selectedProduct,
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    createOrder,
    updateCartItemQuantity
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;