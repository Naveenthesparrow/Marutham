import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('marutham_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('marutham_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity, selectedOption) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item =>
                item.id === product.id && item.selectedOption.quantity === selectedOption.quantity
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }

            return [...prevCart, { ...product, quantity, selectedOption }];
        });
    };

    const removeFromCart = (productId, optionQuantity) => {
        setCart(prevCart => prevCart.filter(item =>
            !(item.id === productId && item.selectedOption.quantity === optionQuantity)
        ));
    };

    const updateQuantity = (productId, optionQuantity, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart => prevCart.map(item =>
            (item.id === productId && item.selectedOption.quantity === optionQuantity)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.selectedOption.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
