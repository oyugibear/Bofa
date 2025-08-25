'use client'

import { Provider } from "react-redux";
import store from './store'
import { ReactNode, useEffect } from 'react'
import { useAppDispatch } from './store'
import { hydrateCart } from './Features/cart/CartSlice'

// Component that handles cart hydration after Redux provider is available
function CartHydrator() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Hydrate cart from localStorage after component mounts
    dispatch(hydrateCart())
  }, [dispatch])

  return null
}

// Wrapper component that includes cart hydration
function ReduxContent({ children }: { children: ReactNode }) {
  return (
    <>
      <CartHydrator />
      {children}
    </>
  )
}

export function Providers({ children } : { children: ReactNode }) {
    return(
        <Provider store={store}>
            <ReduxContent>
                {children}
            </ReduxContent>
        </Provider>
    )
}