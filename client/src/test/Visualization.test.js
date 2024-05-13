import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DataVisualization from '../components/Visualization';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { waitForElementToBeRemoved } from '@testing-library/dom';
// Mock the navigation
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('DataVisualization', () => {
  let consoleSpy;
  // Setup mock fetch in the global scope
  beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            // ok: false, // Set ok property to false for unsuccessful response
            // status: 401, // Unauthorized response for the login attempt
            // json: () => Promise.resolve({ message: "Unauthorized" }),
            // text: () => Promise.resolve("No current user")
            ok: true,
            json: () => Promise.resolve([{ answer1: "10", answer2: "20", username: "user1" }]),
            text: () => Promise.resolve("Current user information")

        })
    );
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
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

    const { asFragment } = render(<Router><DataVisualization /></Router>);
    await waitFor(() => {
      expect(screen.getByText("Data Visualization - Bar Chart")).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches data and displays it correctly', async () => {
    // Return mock data for the fetch call
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ answer1: "Yes", answer2: "No", answer3: "Maybe", username: "testUser" }],
    });

    render(<Router><DataVisualization /></Router>);

    await waitFor(() => {
      expect(screen.getByText("testUser")).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch data'));
    const { getByText } = render(
      <Router>
        <DataVisualization />
      </Router>
    );
    // doesn't crash
  });

    it('updates the charts when a new answer type is selected', async () => {
        global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ answer1: '10', answer2: '20', answer3: '30', username: 'User1' }]
        });

        render(
        <Router>
            <DataVisualization />
        </Router>
        );

        const initialItems = await screen.findAllByText('10');
        expect(initialItems.length).toBeGreaterThan(0); // Confirm initial data loaded
        act(() => {
            fireEvent.change(screen.getByLabelText('Select Answer Type:'), { target: { value: 'answer2' } });
        });
        const updatedItems = await screen.findAllByText('20');
        expect(updatedItems.length).toBeGreaterThan(0); // Confirm updated data is displayed
    });
});
