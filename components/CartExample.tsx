'use client'

import { useCart } from '@/hooks/useCart'

export default function CartExample() {
  const { products, quantity, totalAmount, isHydrated, addToCart, removeFromCart, clearCart } = useCart()

  const handleAddSampleProduct = () => {
    const sampleProduct = {
      _id: `product-${Date.now()}`,
      name: 'Sample Product',
      price: 29.99,
      description: 'This is a sample product'
    }
    
    addToCart(sampleProduct, '2025-08-10', '14:30')
  }

  // Don't render until cart is hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      
      <div className="mb-4">
        <p className="text-lg">Items: {quantity}</p>
        <p className="text-lg font-semibold">Total: ${totalAmount.toFixed(2)}</p>
      </div>

      <div className="space-y-2 mb-4">
        {products.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
                {product.date && <p className="text-xs text-gray-500">Date: {product.date}</p>}
                {product.time && <p className="text-xs text-gray-500">Time: {product.time}</p>}
              </div>
              <button
                onClick={() => removeFromCart(product._id)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={handleAddSampleProduct}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Sample Product
        </button>
        
        {products.length > 0 && (
          <button
            onClick={clearCart}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Cart
          </button>
        )}
      </div>
    </div>
  )
}
