import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DEFAULT_SESSION_LENGTH, MIN_LENGTH_IN_MINUTES, MAX_LENGTH_IN_MINUTES} from './App';
import App from './App';

describe('Tests for the SessionSetup component', () => {
  it('should decrement the session length when clicked', async () => {
    render(<App />);

    const decrementSessionLength =
      screen.getByRole('button',{name: "Decrement session length"});

    await userEvent.click(decrementSessionLength);

    const sessionLength= screen.getByTitle('Session length in minutes').textContent;

    expect(sessionLength).toBe((DEFAULT_SESSION_LENGTH - 1).toString());

  });

  it('should not let a session length be less than 1 minute' , async () => {
    render(<App />);

    const decrementSessionLength =
      screen.getByRole('button',{name: "Decrement session length"});

    let sessionLength = screen.getByTitle('Session length in minutes').textContent;

    // Decrement the session length until it equals 1
    while(sessionLength !== '1'){
      await userEvent.click(decrementSessionLength);
      sessionLength = screen.getByTitle('Session length in minutes').textContent;
    }

    expect(sessionLength).toBe('1');

    // Try to click again
    await userEvent.click(decrementSessionLength);

    sessionLength = screen.getByTitle('Session length in minutes').textContent;

    expect(sessionLength).toBe('1');

  });

  it('should increment the session length when clicked', async () => {
    render(<App />);

    const incrementSessionLength =
      screen.getByRole('button',{name: "Increment session length"});

    await userEvent.click(incrementSessionLength);

    const sessionLength= screen.getByTitle('Session length in minutes').textContent;

    expect(sessionLength).toBe((DEFAULT_SESSION_LENGTH + 1).toString());

  });

  it('should not let a session length be greater than 60 minutes' , async () => {
    render(<App />);

    const incrementSessionLength =
      screen.getByRole('button',{name: "Increment session length"});

    let sessionLength= screen.getByTitle('Session length in minutes').textContent;

    // Increment the session length until it equals 60
    while(sessionLength !== '60'){
      await userEvent.click(incrementSessionLength);
      sessionLength = screen.getByTitle('Session length in minutes').textContent;
    }

    expect(sessionLength).toBe('60');

    // Try to click again
    await userEvent.click(incrementSessionLength);
    sessionLength = screen.getByTitle('Session length in minutes').textContent;

    expect(sessionLength).toBe(MAX_LENGTH_IN_MINUTES.toString());

  });
});



