import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for better TypeScript support
interface Product {
    _id: string;
    price: number;
    date?: string;
    time?: string;
    [key: string]: any;
}

interface CartState {
    products: Product[];
    quantity: number;
    totalAmount: number;
    isHydrated: boolean;
}

// Initial state - always start with empty state to avoid hydration errors
const initialState: CartState = {
    products: [],
    quantity: 0,
    totalAmount: 0,
    isHydrated: false,
};

// Helper function to save cart to localStorage
const saveCartToStorage = (state: CartState) => {
    if (typeof window !== 'undefined' && state.isHydrated) {
        try {
            const cartData = {
                products: state.products,
                quantity: state.quantity,
                totalAmount: state.totalAmount,
            };
            localStorage.setItem('cart', JSON.stringify(cartData));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Action to hydrate cart from localStorage after component mounts
        hydrateCart: (state: CartState) => {
            if (typeof window !== 'undefined') {
                try {
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        const parsedCart = JSON.parse(savedCart);
                        state.products = parsedCart.products || [];
                        state.quantity = parsedCart.quantity || 0;
                        state.totalAmount = parsedCart.totalAmount || 0;
                    }
                } catch (error) {
                    console.error('Failed to hydrate cart from localStorage:', error);
                }
            }
            state.isHydrated = true;
        },

        addProduct: (state: CartState, action: PayloadAction<{ product: Product; date?: string; time?: string }>) => {
            const { product, date, time } = action.payload;
            const productWithDateTime: Product = { ...product, date, time };
            state.products.push(productWithDateTime);
            state.quantity += 1;
            
            // Calculate total amount properly
            state.totalAmount = state.products.reduce((total: number, product: Product) => {
                return total + Number(product.price);
            }, 0);
            
            saveCartToStorage(state);
        },
        
        removeProductFromCart: (state: CartState, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            console.log("Removing product with ID:", id);
            const productIndex = state.products.findIndex((p: Product) => p._id === id);
      
            if (productIndex !== -1) {
              // If the product is found in the cart, remove it
              state.products.splice(productIndex, 1);
              state.quantity -= 1;
              
              // Recalculate total amount
              state.totalAmount = state.products.reduce((total: number, product: Product) => {
                return total + Number(product.price);
              }, 0);
            }
            
            saveCartToStorage(state);
        },
        
        reset: (state: CartState) => {
            state.products = [];
            state.totalAmount = 0;
            state.quantity = 0;
            
            // Delete content in local storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
        },

        replaceCart: (state: CartState, action: PayloadAction<CartState>) => {
            return { ...action.payload, isHydrated: state.isHydrated };
        }
    }
});

export const { addProduct, reset, replaceCart, removeProductFromCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
export type { CartState, Product };