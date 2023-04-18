import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

let startStopButton;
let beepToBePlayed;
let mockPlay;

beforeEach(() => {
  jest.useFakeTimers();

  render(<App />);

  startStopButton = screen.getByRole('button',{name: "Start/stop clock"});
  beepToBePlayed = screen.getByTestId('beep');

  mockPlay = jest.spyOn(beepToBePlayed, 'play').mockImplementation(() => {});

});

afterEach(() => {
  mockPlay.mockRestore();
})

it('should render properly', () => {
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

it('should start, stop and resume the clock', async () => {
  const initialTimeLeft = screen.getByTestId('time-left').textContent;

  await userEvent.click(startStopButton);

  // Advance the timer by 1000ms
  act(() => { jest.advanceTimersByTime(1000); } );

  const timeLeftAfterOneSecond = screen.getByTestId('time-left').textContent;

  expect(timeLeftAfterOneSecond).not.toEqual(initialTimeLeft);

  await userEvent.click(startStopButton);

  act(() => { jest.advanceTimersByTime(1000); } );

  const timeLeftAfterClockStopped = screen.getByTestId('time-left').textContent;

  expect(timeLeftAfterClockStopped).toEqual(timeLeftAfterOneSecond);

  await userEvent.click(startStopButton);

  act(() => { jest.advanceTimersByTime(1000); } );

  const currentTimeLeft = screen.getByTestId('time-left').textContent;

  expect(currentTimeLeft).not.toEqual(timeLeftAfterClockStopped);


});

it( 'should play a beep and start a break when the session ends', async () => {
  await userEvent.click(startStopButton);

  //Advance the timer by 25mins
  act(() => { jest.advanceTimersByTime(1500000); } );

  expect(mockPlay).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('heading',{name: "Break"})).toBeInTheDocument();

  const currentTimeLeft = screen.getByTestId('time-left').textContent;
  // Get the minutes part of the display
  // Cast to number to remove any 0 in the beginning
  const minutesLeft = Number(currentTimeLeft.split(':')[0]);
  const breakLength = Number(screen.getByTitle('Break length in minutes').textContent);

  expect(minutesLeft).toEqual(breakLength);

});

it('should play a beep and start a session when the break ends', async () =>{
  await userEvent.click(startStopButton);

  //Advance the timer by 25mins + 5mins (session + break)
  act(() => { jest.advanceTimersByTime(1500000); } );
  //TODO analyze why this have to be done in two times
  act(() => { jest.advanceTimersByTime(300000); } );

  //one beep for the end of the session and other for the end of the break
  expect(mockPlay).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('heading',{name: "Session"})).toBeInTheDocument();

   const currentTimeLeft = screen.getByTestId('time-left').textContent;
  // Get the minutes part of the display
  // Cast to number to remove any 0 in the beginning
  const minutesLeft = Number(currentTimeLeft.split(':')[0]);
  const sessionLength = Number(screen.getByTitle('Session length in minutes').textContent);

  expect(minutesLeft).toEqual(sessionLength);

});
