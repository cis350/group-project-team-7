import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('True should be true', () => {
  expect(true).toBe(true);
});

test('renders the login page as default', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Ensure that the Login button or related text exists
  const loginElement = screen.getByText(/Login/i); // Adjust this line if "Login" is part of a button or other element.
  expect(loginElement).toBeInTheDocument();
});