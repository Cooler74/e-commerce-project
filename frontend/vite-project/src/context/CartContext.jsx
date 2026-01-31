import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Load cart from local storage on startup
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cartItems');
    return localData ? JSON.parse(localData) : [];
  });

  // NEW: 2. Load shipping address from local storage on startup
  const [shippingAddress, setShippingAddress] = useState(() => {
    const localAddress = localStorage.getItem('shippingAddress');
    return localAddress ? JSON.parse(localAddress) : {};
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);

      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...existItem, qty: existItem.qty + qty } : x
        );
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });

    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored", 
    });
  };

  const removeFromCart = (id) => {
    const itemToRemove = cartItems.find((x) => x._id === id);
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
    
    if (itemToRemove) {
      toast.info(`${itemToRemove.name} removed from cart`, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  // NEW: 3. Function to save shipping address
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Calculate Total Price dynamically
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    toast.info("Cart cleared");
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalPrice,
        shippingAddress, // Exported for use in Shipping.jsx
        saveShippingAddress // Exported for use in Shipping.jsx
      }}
    >
      {children}
    </CartContext.Provider>
  );
};