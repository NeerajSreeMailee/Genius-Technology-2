# Reusable Components

## QuantitySelector Component

A reusable, accessible quantity selector component for e-commerce applications.

### Features:
- Increase/decrease quantity with proper bounds checking
- Customizable min/max values
- Callback for quantity changes
- Disabled states for min/max limits
- Accessible with ARIA labels
- Responsive design
- Works with multiple instances on the same page

### Usage:

```jsx
import QuantitySelector from '@/components/quantity-selector';

// Basic usage
<QuantitySelector />

// With custom props
<QuantitySelector
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

### Example in Product Lists:

The component works perfectly in product lists or shopping carts where multiple instances are needed. Each instance maintains its own state independently.

See `components/product-list-example.tsx` for a complete implementation example.