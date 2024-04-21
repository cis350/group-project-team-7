import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock server response for the login functionality
const server = setupServer(
  rest.post(`${process.env.REACT_APP_SERVER_URL}/login`, (req, res, ctx) => {
    return res(ctx.json({ status: 201 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders login inputs and a button', () => {
  render(<Router><Login /></Router>);
  
  // Check for input fields
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

  // Check for the login button
  expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
});



// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import Login from '../components/Login';
// import App from '../App.js'

// test('render login page', async () => {
//   render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//   );

//   const loginText = await screen.findByText(/login/i);
//   expect(loginText).toBeInTheDocument();


//   // Get sign-up link
//   // const signupLinkElement = screen.getByText(/Sign up/i);
  
//   // expect(signupLinkElement).toBeInTheDocument();
// })