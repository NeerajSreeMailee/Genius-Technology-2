# Testing the Fixed Quantity Selector Component

## Manual Testing Guide

Since testing libraries are not currently installed in the project, here's how to manually test the FixedQuantitySelector component:

### Test 1: Basic Functionality
1. Navigate to `/test-quantity` page
2. Observe three products with different stock levels (5, 10, and 3)
3. Verify that each product has its own independent quantity selector

### Test 2: Increment Functionality
1. For each product, click the "+" button
2. Verify that the quantity increases by 1
3. Continue clicking until you reach the stock limit
4. Verify that the "+" button becomes disabled at the stock limit

### Test 3: Decrement Functionality
1. Set a quantity greater than 1 for any product
2. Click the "-" button
3. Verify that the quantity decreases by 1
4. Continue clicking until you reach 1
5. Verify that the "-" button becomes disabled at quantity 1

### Test 4: Direct Input
1. Type a number directly into the input field
2. Verify that:
   - Numbers below 1 are clamped to 1
   - Numbers above the stock limit are clamped to the stock limit
   - Valid numbers within range are accepted

### Test 5: Edge Cases
1. Try entering non-numeric values (should be ignored or reset to valid values)
2. Try entering decimal numbers (should be converted to integers)
3. Try leaving the field empty (should reset to 1)

## Automated Testing (When Libraries Are Installed)

When testing libraries like Jest and React Testing Library are installed, the component can be tested with the following test cases:

```javascript
// Example test structure (requires @testing-library/react and Jest)
import { render, screen, fireEvent } from '@testing-library/react'
import FixedQuantitySelector from '../components/fixed-quantity-selector'

describe('FixedQuantitySelector', () => {
  it('should render with initial quantity', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={2}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    expect(screen.getByRole('spinbutton')).toHaveValue(2)
  })

  it('should increment quantity when plus button is clicked', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={1}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    fireEvent.click(screen.getByLabelText('Increase quantity'))
    expect(screen.getByRole('spinbutton')).toHaveValue(2)
  })

  // Additional tests would cover:
  // - Decrement functionality
  // - Stock limit enforcement
  // - Minimum quantity enforcement
  // - Input validation and clamping
})
```

## Installation Commands for Testing Libraries

If you want to add automated testing capabilities, run:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
```

Then configure Jest in your project to enable running the tests.