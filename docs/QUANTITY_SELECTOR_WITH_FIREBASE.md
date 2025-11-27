# Quantity Selector with Firebase Integration

## Overview

This document explains how the quantity selector component works with Firebase's `available_quantity` field to ensure proper stock management in the e-commerce application.

## Component Structure

The quantity selector is implemented as a reusable React component that:
1. Accepts stock limits from Firebase data
2. Enforces quantity constraints (1 to available_quantity)
3. Works independently for multiple products
4. Provides both button and direct input controls

## Firebase Integration

In the Firebase data mapping (`firebase-collections.ts`), the stock information is normalized:

```javascript
stock: (() => {
  const stockValue = rawData.stock || rawData.Stock || rawData.quantity || 
                    rawData.Quantity || rawData.available || rawData.Available || 
                    rawData.inStock || rawData.InStock || rawData.inventory || 
                    rawData.Inventory || 1
  return Math.max(0, Number(stockValue) || 1)
})(),
```

This means the component can access stock information through the `mobile.stock` property.

## Component Implementation

The [FixedQuantitySelector](file:///Users/apple/Desktop/Genius-Technology/components/fixed-quantity-selector.tsx#L7-L48) component in `components/fixed-quantity-selector.tsx` handles all the required functionality:

1. **State Management**: Uses React's useState to track quantity independently for each product
2. **Increment/Decrement**: Buttons that adjust quantity within stock limits
3. **Direct Input**: Allows typing numbers with automatic clamping
4. **Validation**: Ensures quantity stays between 1 and available stock
5. **Callback**: Notifies parent components of quantity changes

## Usage in MobileClientPage

In the mobile product page, the component is used as follows:

```jsx
<FixedQuantitySelector
  initialQuantity={quantity}
  availableQuantity={mobile.stock || 10}
  onQuantityChange={setQuantity}
  className="text-xl"
/>
```

## Key Features

1. **Stock Limit Enforcement**: Quantity cannot exceed `available_quantity`
2. **Minimum Quantity**: Quantity cannot go below 1
3. **Input Validation**: Direct number input is automatically clamped
4. **Multiple Product Support**: Each product maintains its own quantity state
5. **Disabled States**: Buttons disable appropriately at limits
6. **Accessibility**: Proper ARIA labels for screen readers

## Testing

A test page is available at `/test-quantity` to verify functionality with multiple products having different stock levels.