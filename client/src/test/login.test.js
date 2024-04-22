import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';

test('should match the snapshot', () => {
    /**
     * Renders the Login component within a Router and returns the rendered component's fragment.
     * @returns {ReactTestRendererJSON} The fragment of the rendered Login component.
     */
    const { asFragment } = render(
      <Router>
        <Login />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
});

test('username input box is in the document', () => {
    render(
    <Router>
        <Login />
    </Router>
    );
    const usernameInput = screen.getByLabelText(/username/i);
    expect(usernameInput).toBeInTheDocument();
});

test('password input box is in the document', () => {
    render(
    <Router>
        <Login />
    </Router>
    );
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
});

test('continue button is in the document', () => {
    render(
    <Router>
        <Login />
    </Router>
    );
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeInTheDocument();
});

test('the sign-up link is in the document', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signup');
});  
