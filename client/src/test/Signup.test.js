import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../components/Signup.js'; 
import toast from 'react-hot-toast';

describe('Signup Component', () => {
    test('should match the snapshot', () => {
        const { asFragment } = render(
            <Router>
                <Signup />
            </Router>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    test('username input box is in the document', () => {
        render(
            <Router>
                <Signup />
            </Router>
        );
        const usernameInput = screen.getByLabelText(/username/i);
        expect(usernameInput).toBeInTheDocument();
    });

    test('password input box is in the document', () => {
        render(
            <Router>
                <Signup />
            </Router>
        );
        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput).toBeInTheDocument();
    });

    test('continue button is in the document', () => {
        render(
            <Router>
                <Signup />
            </Router>
        );
        const continueButton = screen.getByRole('button', { name: /continue/i });
        expect(continueButton).toBeInTheDocument();
    });

    test('the login link is in the document', () => {
        render(
            <Router>
                <Signup />
            </Router>
        );
        const loginLink = screen.getByRole('link', { name: /log in/i });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
    });
});
jest.mock('react-hot-toast');

test('user enters username + password and then is successful', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const usernameInput = screen.getByTestId('username-input').querySelector('input');
    const passwordInput = screen.getByTestId('password-input').querySelector('input');
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    // user enters username + password
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    expect(usernameInput.value).toBe('newuser');
    expect(passwordInput.value).toBe('newpassword');

    // user clicks the signup button
    fireEvent.click(continueButton);
    expect(usernameInput.value).toBe('newuser');
    expect(passwordInput.value).toBe('newpassword');
});

test('user attempts to signup with empty username', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const usernameInput = screen.getByTestId('username-input').querySelector('input');
    const passwordInput = screen.getByTestId('password-input').querySelector('input');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
  
    // user attempts to signup with empty username and non-empty password
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.click(continueButton);
  
    // expect toast error for empty username
    expect(toast.error).toHaveBeenCalledWith("Username must be filled");
  });
  
  test('user attempts to signup with invalid username and password', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        // bad request response for the signup attempt
        status: 400,  
        json: () => Promise.resolve({ message: "Invalid username or password" }),
        text: () => Promise.resolve("Invalid username or password")
      })
    );
  
    render(
      <Router>
        <Signup />
      </Router>
    );
  
    const usernameInput = screen.getByTestId('username-input').querySelector('input');
    const passwordInput = screen.getByTestId('password-input').querySelector('input');
    const continueButton = screen.getByRole('button', { name: /Continue/i });
  
    fireEvent.change(usernameInput, { target: { value: 'baduser' } });
    fireEvent.change(passwordInput, { target: { value: 'badpassword' } });
    fireEvent.click(continueButton);
  
    await waitFor(() => {
        expect(toast.error).toHaveBeenNthCalledWith(1, "Username in use");
        // expect(toast.error).toHaveBeenNthCalledWith(2, "Username in use");
    });      
});
  