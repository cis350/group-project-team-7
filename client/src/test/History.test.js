import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import UserAnswers from '../components/History';
import { fireEvent } from '@testing-library/react';

jest.mock('react-hot-toast', () => {
  return {
    toast: {
      success: jest.fn(),
      error: jest.fn()
    }
  };
});

// Mock the navigation
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('History', () => {
  // Setup mock fetch in the global scope
  beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ answer1: "10", answer2: "20", username: "user1" }]),
            text: () => Promise.resolve("Current user information")
        })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and matches the snapshot', async () => {
    // Setup fetch to return some data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ answer1: "10", answer2: "20", answer3: "30", username: "user1" }],
    });

    const { asFragment } = render(<Router><UserAnswers /></Router>);
    await waitFor(() => {
        expect(screen.getByText("Your Post History:")).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches data and displays it correctly', async () => {
    // Return mock data for the fetch call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ answer1: "Yes", answer2: "No", answer3: "Maybe", username: "testUser" }],
    });

    render(<Router><UserAnswers /></Router>);

    await waitFor(() => {
        expect(screen.getByText("Your Post History:")).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch data'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Router>
        <UserAnswers />
      </Router>
    );

    await waitFor(() => {
      // Verify console error was called with both the error message and the actual error object
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user answers:", 
        expect.any(Error) // This checks if the second argument is an instance of Error
      );
    });

    // Check for UI not showing any user answers
    const posts = screen.queryByText(/Post \d+/i);
    expect(posts).toBeNull();

    consoleSpy.mockRestore();
  });

  it('deletes a user answer post and updates the UI', async () => {
    // Setup initial state and mock fetch for both fetch operations
    const initialAnswers = [{ _id: 'post100', answer1: "Yes", answer2: "No", answer3: "Maybe", answer4: "Definitely" }];
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialAnswers,
      }) // Initial fetch for loading data
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Assume delete operation returns an empty object
      });

    render(<Router><UserAnswers /></Router>);

    await screen.findByText("Post 1"); // Make sure the post is initially rendered

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Ensure the post is no longer in the document
    await waitFor(() => {
      expect(screen.queryByText("Post 10")).not.toBeInTheDocument();
    });

}, 1000000); // Increase timeout if necessary to allow for state updates


  

});