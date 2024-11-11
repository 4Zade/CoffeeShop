import React from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import test from 'node:test';
import assert from 'node:assert';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import CartButton from './CartButton'; // Corrected import for CartButton

// Updated UserProps to match the expected structure in AuthContext
interface UserProps {
  id: number; // Changed to number
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
  favorites: string[];
  favorite: number[]; // Changed to number[]
}

// Mock useAuth for testing
const mockUseAuth = (auth: boolean, user: UserProps | undefined = undefined) => ({
  auth,
  checkAuth: () => Promise.resolve(),
  user: user ?? {
    id: 123, // Example number
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    roles: ['user'],
    favorites: ['item1'],
    favorite: [1, 2, 3], // Array of numbers
  },
});

// Updated CartDetails to match the expected structure in CartContext
interface CartDetails {
  count: number;
  items: any[];
  code: string;
  total: string;
  subtotal: string;
  currency: string;
  taxes: number;
  discount: string; // Fixed to string
  percentage: number;
}

// Mock useCart for testing
const mockUseCart = (count: number) => ({
  cart: {
    count,
    items: [],
    code: '',
    total: '0',
    subtotal: '0',
    currency: 'EUR',
    taxes: 0,
    discount: '0', // Fixed to string
    percentage: 0,
  },
  getCart: async () => ({
    count,
    items: [],
    code: '',
    total: '0',
    subtotal: '0',
    currency: 'EUR',
    taxes: 0,
    discount: '0', // Fixed to string
    percentage: 0,
  }),
  addItemToCart: (_item: any): Promise<void> => {
    return Promise.resolve(); // Ensuring the method returns a Promise<void>
  },
  updateItemQuantity: (_itemId: number, _quantity: number): Promise<void> => {
    return Promise.resolve(); // Ensuring the method returns a Promise<void>
  },
  removeItemFromCart: (_itemId: number): Promise<void> => {
    return Promise.resolve(); // Ensuring the method returns a Promise<void>
  },
});

// Helper function to wrap the component in a router and context providers
const renderWithProviders = (
  ui: ReactNode,
  authValue: { auth: boolean; checkAuth: () => Promise<void>; user: UserProps | undefined },
  cartValue: {
    cart: CartDetails;
    getCart: () => Promise<any>;
    addItemToCart: (item: any) => Promise<void>; // Updated return type
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>; // Updated return type
    removeItemFromCart: (itemId: number) => Promise<void>; // Updated return type
  }
) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <Router>{ui}</Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

// Test cases
test('CartButton renders null when not authenticated', async () => {
  const authValue = mockUseAuth(false);
  const cartValue = mockUseCart(0);

  renderWithProviders(<CartButton />, authValue, cartValue);

  const cartButton = screen.queryByRole('button', { name: /your cart/i });
  assert.strictEqual(cartButton, null);
});

test('CartButton renders cart button with item count when authenticated', async () => {
  const authValue = mockUseAuth(true, { 
    id: 123,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    roles: ['user'],
    favorites: ['item1'],
    favorite: [1, 2, 3], // Array of numbers
  });
  const cartValue = mockUseCart(5);

  renderWithProviders(<CartButton />, authValue, cartValue);

  const cartButton = screen.getByRole('button', { name: /your cart/i });
  assert.ok(cartButton);
  assert.strictEqual(screen.getByText('5').textContent, '5');
});

test('CartButton displays "99+" when cart count exceeds 99', async () => {
  const authValue = mockUseAuth(true, { 
    id: 123,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    roles: ['user'],
    favorites: ['item1'],
    favorite: [1, 2, 3], // Array of numbers
  });
  const cartValue = mockUseCart(120);

  renderWithProviders(<CartButton />, authValue, cartValue);

  const countDisplay = screen.getByText('99+');
  assert.ok(countDisplay);
  assert.strictEqual(countDisplay.textContent, '99+');
});

test('Tooltip shows on hover', async () => {
  const authValue = mockUseAuth(true, { 
    id: 123,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    roles: ['user'],
    favorites: ['item1'],
    favorite: [1, 2, 3], // Array of numbers
  });
  const cartValue = mockUseCart(2);

  renderWithProviders(<CartButton />, authValue, cartValue);

  const cartButton = screen.getByRole('button', { name: /your cart/i });
  fireEvent.mouseEnter(cartButton);

  const tooltip = screen.getByText(/your cart/i);
  assert.ok(tooltip);

  fireEvent.mouseLeave(cartButton);

  const tooltipHidden = screen.queryByText(/your cart/i);
  assert.strictEqual(tooltipHidden, null);
});
