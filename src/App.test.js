import { render, screen } from '@testing-library/react';
import App from './App';

it('should render properly', () => {
  render(<App />);

  screen.getByRole('heading',{level: 1, name: "Pomodoro Clock"});
  screen.getByRole('heading',{level: 2, name: "Session"});
  screen.getByRole('heading',{level: 3, name: "Session Length"});
  screen.getByRole('heading',{level: 3, name: "Break Length"});

  screen.getByRole('button',{name: "Decrement session length"});
  screen.getByRole('button',{name: "Increment session length"});
  screen.getByRole('button',{name: "Decrement break length"});
  screen.getByRole('button',{name: "Increment break length"});

  screen.getByTestId('time-left');

  screen.getByRole('button',{name: "Start/stop clock"});
  screen.getByRole('button',{name: "Reset clock"});
});
