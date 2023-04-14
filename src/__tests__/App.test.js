import { render, screen } from '@testing-library/react';
import App from '../App';

it('should render properly', () => {
  render(<App />);

  screen.getByRole('heading',{level: 1, name: "Pomodoro Clock"});
  screen.getByRole('heading',{level: 2, name: "Session"});
  screen.getByRole('heading',{level: 3, name: "Session Length"});
  screen.getByRole('heading',{level: 3, name: "Break Length"});

  screen.getByRole('button',{name: "Decrement session length"});
  screen.getByRole('button',{name: "Increment session length"});

  const sessionLength= screen.getByTitle('Session length in minutes');
  expect(sessionLength).toHaveTextContent(/^25$/);

  screen.getByRole('button',{name: "Decrement break length"});
  screen.getByRole('button',{name: "Increment break length"});

  const breakLength= screen.getByTitle('Break length in minutes');
  expect(breakLength).toHaveTextContent(/^5$/);

  const timeLeft = screen.getByTestId('time-left');
  expect(timeLeft).toHaveTextContent(/^25:00$/);

  screen.getByRole('button',{name: "Start/stop clock"});
  screen.getByRole('button',{name: "Reset clock"});

  const footer = screen.getByRole('contentinfo');
  expect(footer).toHaveTextContent('Designed and coded by @andersonfer');
});
