# Stock-Aware Quantity Selector Component

A robust React component for e-commerce quantity selection that respects product stock limits.

## Features

- Direct input editing with stock validation
- Increment/decrement buttons with stock awareness
- Automatic clamping to available quantity
- Works with multiple products simultaneously
- Accessible with ARIA labels
- Responsive design
- Visual stock indicator

## Installation

Simply copy the `stock-aware-quantity-selector.tsx` file to your components directory.

## Usage

```jsx
import StockAwareQuantitySelector from '@/components/stock-aware-quantity-selector';

// Basic usage
<StockAwareQuantitySelector 
  availableQuantity={5} 
/>

// With custom props
<StockAwareQuantitySelector
  initialQuantity={2}
  availableQuantity={10}
  minQuantity={1}
  onQuantityChange={(newQuantity) => console.log(newQuantity)}
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialQuantity | number | 1 | Starting quantity value |
| availableQuantity | number | required | Maximum allowed quantity (stock level) |
| minQuantity | number | 1 | Minimum allowed quantity |
| onQuantityChange | function | undefined | Callback when quantity changes |
| className | string | '' | Additional CSS classes |

## Example Implementation

See `components/multi-product-example.tsx` for a complete implementation showing:
- Multiple products with different stock levels
- Cart functionality
- Stock validation
- Error handling

## Key Features Explained

### Stock Awareness
The component automatically prevents users from selecting quantities that exceed the available stock:

```jsx
// If availableQuantity is 5, user cannot select more than 5
<StockAwareQuantitySelector availableQuantity={5} />
```

### Direct Input Validation
Users can type values directly, but the component will automatically clamp values to valid ranges:

```jsx
// If user types 100 but availableQuantity is 5, value becomes 5
// If user types -5, value becomes minQuantity (default 1)
```

### Multiple Product Support
Each instance maintains its own state independently:

```jsx
{products.map(product => (
  <StockAwareQuantitySelector
    key={product.id}
    availableQuantity={product.stock}
    onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
  />
))}
```

## Styling

The component uses Tailwind CSS classes by default but can be customized:

```jsx
<StockAwareQuantitySelector
  availableQuantity={5}
  className="border-2 border-purple-500 rounded-lg"
/>
```

## Accessibility

- Proper ARIA labels for buttons
- Keyboard navigable
- Sufficient color contrast
- Focus states for interactive elements

## Error Handling

The component gracefully handles edge cases:
- Out of stock products (availableQuantity = 0)
- Invalid input values
- Min/max boundary conditions

## Testing

To test the component:

1. Create a test page using the MultiProductExample component
2. Verify direct input editing works correctly
3. Test increment/decrement buttons
4. Check stock limit enforcement
5. Validate multiple product instances work independently
6. Test edge cases (out of stock, zero quantities)

## Integration with State Management

The component works with any state management solution:

### With useState
```jsx
const [quantity, setQuantity] = useState(1);

<StockAwareQuantitySelector
  availableQuantity={10}
  onQuantityChange={setQuantity}
/>
```

### With Context API
```jsx
const { updateCartItem } = useCart();

<StockAwareQuantitySelector
  availableQuantity={product.stock}
  onQuantityChange={(qty) => updateCartItem(productId, qty)}
/>
```

### With Redux
```jsx
const dispatch = useDispatch();

<StockAwareQuantitySelector
  availableQuantity={product.stock}
  onQuantityChange={(qty) => dispatch(updateQuantity(productId, qty))}
/>
```

## Customization

You can customize the appearance by passing additional classes or modifying the component directly:

```jsx
// Custom styling
<StockAwareQuantitySelector
  availableQuantity={5}
  className="text-xl bg-gray-100 rounded-full"
/>

// Custom min quantity
<StockAwareQuantitySelector
  availableQuantity={10}
  minQuantity={0} // Allow zero quantities
/>
```

## Browser Support

The component works in all modern browsers that support React and ES6.

## Performance

- Lightweight implementation
- No external dependencies
- Efficient state updates
- Memoized calculations where appropriate

## Troubleshooting

### Issue: Component not updating
Ensure you're passing the `onQuantityChange` callback and updating your state properly.

### Issue: Stock limits not enforced
Verify that `availableQuantity` is being passed correctly and is a valid number.

### Issue: Multiple instances interfering with each other
Ensure each instance has a unique key when used in a list.