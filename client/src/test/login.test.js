import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';
import toast from 'react-hot-toast';

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

// user enters username + password and then is successful
test('user enters username + password and then is successful', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const usernameInput = screen.getByTestId('username-input').querySelector('input');
    const passwordInput = screen.getByTestId('password-input').querySelector('input');
    const continueButton = screen.getByRole('button', { name: /continue/i });

    // user enters username + password
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');

    // user clicks the continue button
    continueButton.click();
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
});

jest.mock('react-hot-toast');

test('user attempts to login with empty username', () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const usernameInput = screen.getByTestId('username-input').querySelector('input');
  const passwordInput = screen.getByTestId('password-input').querySelector('input');
  const continueButton = screen.getByRole('button', { name: /continue/i });

  // user attempts to login with empty username and non-empty password
  fireEvent.change(usernameInput, { target: { value: '' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  fireEvent.click(continueButton);

  // expect toast error for empty username
  expect(toast.error).toHaveBeenCalledWith("Username must be filled");
});

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

test('user attempts to login with incorrect username and password', async () => {
  global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 401,  //  unauthorized response for the login attempt
    json: () => Promise.resolve({ message: "Unauthorized" }), 
    text: () => Promise.resolve("No current user")
  })
  );

  render(
    <Router>
      <Login />
    </Router>
  );

  const usernameInput = screen.getByTestId('username-input').querySelector('input');
  const passwordInput = screen.getByTestId('password-input').querySelector('input');
  const continueButton = screen.getByRole('button', { name: /continue/i });

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  fireEvent.click(continueButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Username or password is incorrect");
  });
});
