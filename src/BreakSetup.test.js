import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DEFAULT_BREAK_LENGTH, MIN_LENGTH_IN_MINUTES, MAX_LENGTH_IN_MINUTES} from './App';
import App from './App';

describe('Tests for the BreakSetup component', () => {

  it('should decrement the break length when clicked', async () => {
    render(<App />);

    const decrementBreakLength =
      screen.getByRole('button',{name: "Decrement break length"});

    await userEvent.click(decrementBreakLength);

    const breakLength= screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe((DEFAULT_BREAK_LENGTH - 1).toString());

  });

  it('should not let a break length be less than 1 minute' , async () => {
    render(<App />);

    const decrementBreakLength =
      screen.getByRole('button',{name: "Decrement break length"});

    // Clicks DEFAULT_BREAK_LENGTH + 1 times to check if it's going below 1
    for(let i=0; i <= DEFAULT_BREAK_LENGTH; i++){
      await userEvent.click(decrementBreakLength);
    }

    const breakLength= screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe(MIN_LENGTH_IN_MINUTES.toString());

  });

  it('should increment the break length when clicked', async () => {
    render(<App />);

    const incrementBreakLength =
      screen.getByRole('button',{name: "Increment break length"});

    await userEvent.click(incrementBreakLength);

    const breakLength= screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe((DEFAULT_BREAK_LENGTH + 1).toString());

  });

  it('should not let a break length be greater than 60 minutes' , async () => {
    render(<App />);

    const incrementBreakLength =
      screen.getByRole('button',{name: "Increment break length"});

    // Clicks MAX_LENGTH_IN_MINUTES + 1 times to check if it's going over 60
    for(let i=0; i <= MAX_LENGTH_IN_MINUTES; i++){
      await userEvent.click(incrementBreakLength);
    }

    const breakLength= screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe(MAX_LENGTH_IN_MINUTES.toString());

  });

});
