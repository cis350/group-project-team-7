import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../components/Home.js';

describe('Home Component', () => {
  test('matches the snapshot', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders the main headline', () => {
    render(<Home />);
    const headline = screen.getByText(/Guiding Students and Parents to a Brighter Future Since 2004/i);
    expect(headline).toBeInTheDocument();
  });

  test('has a login link that navigates to the login page', () => {
    render(<Home />);
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('has a signup link that navigates to the signup page', () => {
    render(<Home />);
    const signupLink = screen.getByRole('link', { name: /signup/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});
