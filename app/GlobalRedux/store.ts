'use client'

import { configureStore } from "@reduxjs/toolkit"
import cartReducer from '@/app/GlobalRedux/Features/cart/CartSlice'
import { useDispatch, useSelector, useStore } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"

const store = configureStore({
    reducer: {
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = useStore

export default store