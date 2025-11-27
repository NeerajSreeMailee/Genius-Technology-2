import React, { useState } from 'react';
import StockAwareQuantitySelector from './stock-aware-quantity-selector';

interface Product {
  id: string;
  name: string;
  price: number;
  availableQuantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const MultiProductExample: React.FC = () => {
  // Sample product data with different stock levels
  const products: Product[] = [
    { id: '1', name: 'Smartphone', price: 699, availableQuantity: 5 },
    { id: '2', name: 'Laptop', price: 1299, availableQuantity: 3 },
    { id: '3', name: 'Headphones', price: 199, availableQuantity: 10 },
    { id: '4', name: 'Tablet', price: 499, availableQuantity: 0 }, // Out of stock
    { id: '5', name: 'Smartwatch', price: 299, availableQuantity: 2 },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})
  );

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id];
    
    // Check if we have enough stock
    if (quantity > product.availableQuantity) {
      alert(`Only ${product.availableQuantity} items available in stock`);
      return;
    }
    
    if (product.availableQuantity === 0) {
      alert('This product is out of stock');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity }];
      }
    });
    
    // Reset quantity to 1 after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
    
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Multi-Product Quantity Selector Demo</h1>
      
      {/* Product List */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-6 shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-lg text-blue-600 font-medium mb-4">${product.price}</p>
              
              <div className="mb-4">
                <StockAwareQuantitySelector
                  availableQuantity={product.availableQuantity}
                  initialQuantity={quantities[product.id] || 1}
                  onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                  minQuantity={product.availableQuantity > 0 ? 1 : 0}
                />
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.availableQuantity === 0}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  product.availableQuantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Qty: {item.quantity}</span>
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
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
            
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiProductExample;