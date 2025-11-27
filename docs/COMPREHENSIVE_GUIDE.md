# Comprehensive E-Commerce Components Guide

This guide explains how to use the enhanced e-commerce components for your React/Tailwind CSS application.

## Components Overview

1. **EnhancedQuantitySelector** - A fully functional quantity selector with direct input and button controls
2. **CenteredProductDetails** - A responsive, centered product details component
3. **MobileClientPage** - Updated main product page using the new components

## 1. EnhancedQuantitySelector Component

### Features:
- Direct input editing
- Increment/decrement buttons
- Min/max value constraints
- Real-time validation
- Works with multiple instances
- Accessible with ARIA labels

### Usage:

```jsx
import EnhancedQuantitySelector from '@/components/enhanced-quantity-selector';

// Basic usage
<EnhancedQuantitySelector />

// With custom props
<EnhancedQuantitySelector
  initialQuantity={2}
  minQuantity={1}
  maxQuantity={5}
  onQuantityChange={(newQuantity) => console.log(newQuantity)}
  className="my-custom-class"
/>
```

### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialQuantity | number | 1 | Starting quantity value |
| minQuantity | number | 1 | Minimum allowed quantity |
| maxQuantity | number | 10 | Maximum allowed quantity |
| onQuantityChange | function | undefined | Callback when quantity changes |
| className | string | '' | Additional CSS classes |

## 2. CenteredProductDetails Component

### Features:
- Horizontally centered layout
- Responsive design for all screen sizes
- Clean, modern styling with subtle shadows
- Integrated with EnhancedQuantitySelector
- Proper spacing and typography

### Usage:

```jsx
import CenteredProductDetails from '@/components/centered-product-details';

<CenteredProductDetails
  product={productData}
  onAddToCart={(productId, quantity) => handleAddToCart(productId, quantity)}
  onToggleWishlist={(productId) => handleToggleWishlist(productId)}
/>
```

### Props:

| Prop | Type | Description |
|------|------|-------------|
| product | Product object | Product information to display |
| onAddToCart | function | Handler for adding to cart |
| onToggleWishlist | function | Handler for wishlist toggle |

### Product Object Structure:

```typescript
{
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  inWishlist?: boolean;
}
```

## 3. Implementation in MobileClientPage

The main product page has been updated to:
1. Use the EnhancedQuantitySelector component
2. Center the product details section using flexbox
3. Maintain all existing functionality
4. Keep responsive design for all screen sizes

### Key Changes:

1. **Centering the product details:**
   ```jsx
   {/* Centered Product Details */}
   <div className="lg:col-span-6 flex justify-center">
     <div className="w-full max-w-2xl">
       {/* Product details content */}
     </div>
   </div>
   ```

2. **Using the enhanced quantity selector:**
   ```jsx
   <EnhancedQuantitySelector
     initialQuantity={quantity}
     maxQuantity={mobile.stock || 10}
     onQuantityChange={setQuantity}
     className="text-xl"
   />
   ```

## 4. Multiple Products Support

Both components work seamlessly with multiple products:

```jsx
// In a product list
{products.map(product => (
  <CenteredProductDetails
    key={product.id}
    product={product}
    onAddToCart={handleAddToCart}
    onToggleWishlist={handleToggleWishlist}
  />
))}
```

Each instance maintains its own state independently, ensuring that changing one product's quantity doesn't affect others.

## 5. Styling and Responsiveness

All components use Tailwind CSS classes for:
- Responsive design (mobile, tablet, desktop)
- Consistent spacing and typography
- Accessible color contrast
- Smooth transitions and hover effects
- Subtle shadows for depth

### Customization:

You can customize the appearance by passing additional classes:

```jsx
<EnhancedQuantitySelector 
  className="text-xl border-2 border-purple-500 rounded-lg" 
/>
```

## 6. Accessibility Features

- Proper ARIA labels for buttons
- Keyboard navigable
- Sufficient color contrast
- Focus states for interactive elements
- Semantic HTML structure

## 7. Example Implementations

See the following files for complete examples:
- `components/enhanced-quantity-selector.tsx` - Standalone quantity selector
- `components/centered-product-details.tsx` - Complete product details component
- `components/product-details-example.tsx` - Full implementation example
- `app/mobile/[id]/MobileClientPage.tsx` - Updated main product page

## 8. Testing the Components

To test the components:

1. Ensure you have the required dependencies installed
2. Import the components into your page
3. Pass the required props
4. Test functionality:
   - Direct input editing
   - Button increment/decrement
   - Min/max constraints
   - Multiple product instances
   - Responsive behavior

## 9. Troubleshooting

### Issue: Quantity selector not updating
**Solution:** Ensure you're passing the `onQuantityChange` callback and updating state properly

### Issue: Product details not centered
**Solution:** Check that the parent container uses `flex justify-center` and the content has a max-width

### Issue: Components not responsive
**Solution:** Verify Tailwind CSS is properly configured and classes are applied correctly

## 10. Best Practices

1. Always provide meaningful initial values
2. Set appropriate min/max constraints based on stock
3. Handle edge cases (out of stock, invalid inputs)
4. Use consistent styling across your application
5. Test with multiple product instances
6. Ensure accessibility standards are met
7. Optimize for performance with proper state management