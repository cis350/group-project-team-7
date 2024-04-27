import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App.js';

test('renders guiding text', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  /**
   * Represents the link element with the text "Guiding Students and Parents to a Brighter Future Since 2004".
   * @type {HTMLElement}
   */
  const linkElement = screen.getByText(/Guiding Students and Parents to a Brighter Future Since 2004/i);
  expect(linkElement).toBeInTheDocument();
});
