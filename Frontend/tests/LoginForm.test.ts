import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../src/components/Forms/LoginForm';
import assert from 'assert';
import { describe, it } from 'node:test';
import { ReactNode } from 'react';


// Wrapper to render components with BrowserRouter
const renderWithRouter = (ui: ReactNode) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('LoginForm Component', () => {
  it('renders the login form correctly', () => {
    renderWithRouter(<LoginForm />);
    // Check if the form elements are rendered correctly
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    assert.notEqual(emailInput, null, 'Email input should be rendered');
    assert.notEqual(passwordInput, null, 'Password input should be rendered');
    assert.notEqual(submitButton, null, 'Submit button should be rendered');
  });

  it('shows validation error for missing email and password', async () => {
    renderWithRouter(<LoginForm />);

    // Click submit button without filling the form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Check for error messages
    const emailError = await screen.findByText(/email is required/i);
    const passwordError = await screen.findByText(/password is required/i);

    assert.notEqual(emailError, null, 'Email error message should be shown');
    assert.notEqual(passwordError, null, 'Password error message should be shown');
  });

  it('displays loading state while submitting', async () => {
    renderWithRouter(<LoginForm />);

    // Fill the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait for the button text to change to "Logging in..."
    await waitFor(() => {
      const loadingButton = screen.getByRole('button', { name: /logging in.../i });
      assert.notEqual(loadingButton, null, 'Button should show "Logging in..." when loading');
    });
  });

  it('displays an error message when login fails', async () => {
    renderWithRouter(<LoginForm />);

    // Fill in form with invalid credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/an error occurred/i);
    assert.notEqual(errorMessage, null, 'Error message should be displayed when login fails');
  });
});
