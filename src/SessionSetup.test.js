import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {DEFAULT_SESSION_LENGTH, MIN_LENGTH_IN_MINUTES, MAX_LENGTH_IN_MINUTES} from './App';
import App from './App';

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

  // Clicks DEFAULT_SESSION_LENGTH + 1 times to check if it's going below 1
  for(let i=0; i <= DEFAULT_SESSION_LENGTH; i++){
    await userEvent.click(decrementSessionLength);
  }

  const sessionLength= screen.getByTitle('Session length in minutes').textContent;

  expect(sessionLength).toBe(MIN_LENGTH_IN_MINUTES.toString());

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

  // Clicks MAX_LENGTH_IN_MINUTES + 1 times to check if it's going over 60
  for(let i=0; i <= MAX_LENGTH_IN_MINUTES; i++){
    await userEvent.click(incrementSessionLength);
  }

  const sessionLength= screen.getByTitle('Session length in minutes').textContent;

  expect(sessionLength).toBe(MAX_LENGTH_IN_MINUTES.toString());

});
