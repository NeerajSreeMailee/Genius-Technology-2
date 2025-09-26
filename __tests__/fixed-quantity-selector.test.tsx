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

  it('should decrement quantity when minus button is clicked', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={5}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    fireEvent.click(screen.getByLabelText('Decrease quantity'))
    expect(screen.getByRole('spinbutton')).toHaveValue(4)
  })

  it('should not increment beyond available quantity', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={10}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    const incrementButton = screen.getByLabelText('Increase quantity')
    expect(incrementButton).toBeDisabled()
    
    fireEvent.click(incrementButton)
    expect(screen.getByRole('spinbutton')).toHaveValue(10)
  })

  it('should not decrement below 1', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={1}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    const decrementButton = screen.getByLabelText('Decrease quantity')
    expect(decrementButton).toBeDisabled()
    
    fireEvent.click(decrementButton)
    expect(screen.getByRole('spinbutton')).toHaveValue(1)
  })

  it('should clamp input values between 1 and available quantity', () => {
    const onQuantityChange = jest.fn()
    render(
      <FixedQuantitySelector
        initialQuantity={5}
        availableQuantity={10}
        onQuantityChange={onQuantityChange}
      />
    )
    
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '15' } })
    expect(input).toHaveValue(10)
    
    fireEvent.change(input, { target: { value: '-5' } })
    expect(input).toHaveValue(1)
  })
})