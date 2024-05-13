import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import UserAnswers from '../components/History.js';
import { BrowserRouter } from 'react-router-dom'; // If your component uses routing features

describe('UserAnswers Component', () => {
    beforeEach(() => {
        fetch.resetMocks();
        jest.spyOn(console, 'error').mockImplementation(); // Mock console.error
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore original implementations
    });

    it('displays user answers on successful fetch', async () => {
        const mockAnswers = [
            { _id: '1', answer1: "Yes", answer2: "No", answer3: "Maybe", answer4: "N/A", username: "test" },
            { _id: '2', answer1: "No", answer2: "Yes", answer3: "Maybe", answer4: "N/A", username: "test" }
        ];
        fetch.mockResponseOnce(JSON.stringify(mockAnswers));

        render(<UserAnswers />, { wrapper: BrowserRouter }); // Wrap in Router if using useParams

        await waitFor(() => {
            expect(screen.getByText("Post 1")).toBeInTheDocument();
        });
    });

    it('handles fetch errors gracefully', async () => {
        fetch.mockReject(new Error('Failed to fetch user answers'));

        render(<UserAnswers />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error fetching user answers:", expect.any(Error));
        });
    });

    it('deletes a post successfully and updates the UI', async () => {
        const mockAnswers = [
            { _id: '1', answer1: "Yes", answer2: "No", answer3: "Maybe", answer4: "N/A", username: "test" }
        ];
        fetch
          .mockResponseOnce(JSON.stringify(mockAnswers)) // Initial load
          .mockResponseOnce(JSON.stringify({}), { status: 200 }); // Mock delete response

        render(<UserAnswers />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText("Yes")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Delete")); // Assumes button text is 'Delete'
        
        await waitFor(() => {
            expect(screen.queryByText("Yes")).not.toBeInTheDocument();
        });
    });

    it('renders correctly and matches snapshot', async () => {
        fetch.mockResponseOnce(JSON.stringify([{ _id: '1', answer1: "Yes", answer2: "No", answer3: "Maybe", answer4: "N/A", username: "test" }]));
        
        const { asFragment } = render(<UserAnswers />, { wrapper: BrowserRouter });
        await waitFor(() => {
            expect(screen.getByText("Yes")).toBeInTheDocument(); // Insert an assertion
        });

        expect(asFragment()).toMatchSnapshot();
    });
});
