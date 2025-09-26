import React, { useState } from 'react';
import QuantitySelector from './quantity-selector';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const ProductListExample: React.FC = () => {
  // Sample product data
  const products: Product[] = [
    { id: '1', name: 'Smartphone', price: 699, stock: 5 },
    { id: '2', name: 'Laptop', price: 1299, stock: 3 },
    { id: '3', name: 'Headphones', price: 199, stock: 10 },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Product List</h1>
      
      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Shopping Cart */}
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <QuantitySelector
                  initialQuantity={item.quantity}
                  maxQuantity={item.product.stock}
                  onQuantityChange={(newQuantity) => 
                    handleQuantityChange(item.product.id, newQuantity)
                  }
                />
                
                <button
                  onClick={() => handleRemoveFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListExample;