import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DEFAULT_BREAK_LENGTH, MIN_LENGTH_IN_MINUTES, MAX_LENGTH_IN_MINUTES} from '../App';
import App from '../App';

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

    let breakLength = screen.getByTitle('Break length in minutes').textContent;

    // Decrement the break length until it equals 1
    while(breakLength !== '1'){
      await userEvent.click(decrementBreakLength);
      breakLength = screen.getByTitle('Break length in minutes').textContent;
    }

    expect(breakLength).toBe('1');

    // Try to decrement again
    await userEvent.click(decrementBreakLength);
    breakLength = screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe('1');

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

    let breakLength= screen.getByTitle('Break length in minutes').textContent;

    while(breakLength !== '60'){
      await userEvent.click(incrementBreakLength);
      breakLength= screen.getByTitle('Break length in minutes').textContent;
    }

    expect(breakLength).toBe('60');

    // Try to click again
    await userEvent.click(incrementBreakLength);
    breakLength= screen.getByTitle('Break length in minutes').textContent;

    expect(breakLength).toBe('60');

  });

});
