'use client'

import { useAppSelector, useAppDispatch } from '@/app/GlobalRedux/store'
import { addProduct, removeProductFromCart, reset } from '@/app/GlobalRedux/Features/cart/CartSlice'
import type { Product } from '@/app/GlobalRedux/Features/cart/CartSlice'

export function useCart() {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(state => state.cart)

  const addToCart = (product: Product, date?: string, time?: string) => {
    dispatch(addProduct({ product, date, time }))
  }

  const removeFromCart = (id: string) => {
    dispatch(removeProductFromCart({ id }))
  }

  const clearCart = () => {
    dispatch(reset())
  }

  return {
    // Cart state
    products: cart.products,
    quantity: cart.quantity,
    totalAmount: cart.totalAmount,
    isHydrated: cart.isHydrated,
    
    // Cart actions
    addToCart,
    removeFromCart,
    clearCart,
  }
}

export type { Product }
