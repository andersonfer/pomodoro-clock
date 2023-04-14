import { render, screen } from '@testing-library/react';
import App from './App';

it('should render properly', () => {
  render(<App />);

  screen.getByRole('heading',{level: 1, name: "Pomodoro Clock"});
  screen.getByRole('heading',{level: 2, name: "Session"});
  screen.getByRole('heading',{level: 3, name: "Session Length"});
  screen.getByRole('heading',{level: 3, name: "Break Length"});

  screen.getByTitle('Decrement session length');
  screen.getByTitle('Increment session length');
  screen.getByTitle('Decrement break length');
  screen.getByTitle('Increment break length');
  //screen.getByRole('');

});
