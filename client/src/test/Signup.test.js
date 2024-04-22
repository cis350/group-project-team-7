import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../components/Signup.js'; 

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
