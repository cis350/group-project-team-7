import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DataVisualization from '../components/Visualization.js';
import { within } from '@testing-library/react';
import { waitFor } from '@testing-library/react';

describe('DataVisualization', () => {
    let consoleSpy;

    beforeEach(() => {
        fetch.resetMocks();
        // Mock console.error before each test
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        // Restore the original console.error after each test
        consoleSpy.mockRestore();
    });

    it('handles fetch errors gracefully', async () => {
        // Setup fetch to reject with an error
        fetch.mockReject(new Error('Failed to fetch data'));

        render(<DataVisualization />);

        // Check that console.error was called with the appropriate message
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "Error fetching data:", expect.any(Error)
            );
        });
    });

    it('renders correctly and matches snapshot', async () => {
        fetch.mockResponseOnce(JSON.stringify([{ answer1: 10, answer2: 20, username: 'User1' }]));
        
        const { asFragment } = render(<DataVisualization />);
        const items = await screen.findAllByText('10');
        expect(items.length).toBeGreaterThan(0); // Check that '10' appears at least once
        expect(asFragment()).toMatchSnapshot();
    });

    it('updates the charts when a new answer type is selected', async () => {
        const mockData = [{ answer1: '10', answer2: '20', answer3: '30', username: 'User1' }];
        fetch.mockResponseOnce(JSON.stringify(mockData));

        render(<DataVisualization />);
        const initialItems = await screen.findAllByText('10');
        expect(initialItems.length).toBeGreaterThan(0); // Confirm initial data loaded

        fireEvent.change(screen.getByLabelText('Select Answer Type:'), { target: { value: 'answer2' } });
        const updatedItems = await screen.findAllByText('20');
        expect(updatedItems.length).toBeGreaterThan(0); // Confirm updated data is displayed
    });

    it('fetches answers from the server and updates the state', async () => {
        const mockData = [{ answer1: 'Strongly Agree', answer2: 'Strongly Disagree', username: 'User1' }];
        fetch.mockResponseOnce(JSON.stringify(mockData));

        render(<DataVisualization />);

        await waitFor(() => {
            const barChart = screen.getByTestId('bar-chart');
            expect(barChart).toBeInTheDocument();
        });
    
        // Assuming that the 'Yes' value is actually used in the labels in your component's rendered output
        await waitFor(() => {
            const labels = within(screen.getByTestId('bar-chart')).queryAllByText('User1');
            expect(labels.length).toBeGreaterThan(0);
        });
    });      

});
