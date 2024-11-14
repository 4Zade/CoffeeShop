import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { test } from 'node:test';
import assert from 'node:assert';
import ContactsForm from '../src/components/Forms/ContactsForm';


// Create a mock instance of axios
const mockAxios = new MockAdapter(axios);
const contactsForm = <ContactsForm/>;

test('should fetch email on mount and disable the email field', async () => {
  // Mock the response of the API to return an authorized email
  mockAxios.onGet('http://localhost:7000/api/v1/auth/status').reply(200, {
    authorized: true,
    data: { email: 'test@example.com' },
  });

  render(<ContactsForm />);

  // Wait for the API call to finish
  await waitFor(() => {
    const emailField = screen.getByDisplayValue('test@example.com') as HTMLInputElement;
    assert(emailField); // Assert that the email field is present
    assert.strictEqual(emailField.disabled, true); // Assert that the email field is disabled
  });
});

test('should submit the form with correct data', async () => {
  // Mock API responses
  mockAxios.onGet('http://localhost:7000/api/v1/auth/status').reply(200, {
    authorized: true,
    data: { email: 'test@example.com' },
  });

  mockAxios.onPost('http://localhost:7000/api/v1/users/contacts').reply(200, {});

  render(<ContactsForm/>);

  // Wait for the form to be populated
  await waitFor(() => screen.getByDisplayValue('test@example.com'));

  // Fill in the form fields
  fireEvent.change(screen.getByPlaceholderText('Let us know how we can help you'), {
    target: { value: 'Test Subject' },
  });
  fireEvent.change(screen.getByPlaceholderText('Leave a comment...'), {
    target: { value: 'Test Message' },
  });

  // Submit the form
  fireEvent.click(screen.getByText('Send message'));

  // Wait for the API call to be made
  await waitFor(() => {
    assert.strictEqual(mockAxios.history.post.length, 1);

    // Check if the post request has the correct data
    const postData = mockAxios.history.post[0].data;
    assert(postData.includes('test@example.com'));
    assert(postData.includes('Test Subject'));
    assert(postData.includes('Test Message'));
  });
});

test('should handle error when submitting form', async () => {
  // Mock the API response to return an error
  mockAxios.onPost('http://localhost:7000/api/v1/users/contacts').reply(500);

  render(<ContactsForm />);

  // Wait for the form to be populated
  await waitFor(() => screen.getByDisplayValue('test@example.com'));

  // Override console.error to track if it gets called
  const originalConsoleError = console.error;
  let errorCalled = false;
  console.error = (...args: any[]) => {
    errorCalled = true;
    originalConsoleError(...args);
  };

  // Fill in the form
  fireEvent.change(screen.getByPlaceholderText('Let us know how we can help you'), {
    target: { value: 'Test Subject' },
  });
  fireEvent.change(screen.getByPlaceholderText('Leave a comment...'), {
    target: { value: 'Test Message' },
  });

  // Submit the form
  fireEvent.click(screen.getByText('Send message'));

  // Wait for the error to be caught
  await waitFor(() => {
    assert.strictEqual(mockAxios.history.post.length, 1);

    // Check if console.error was called
    assert.strictEqual(errorCalled, true);
  });

  // Restore the original console.error
  console.error = originalConsoleError;
});
