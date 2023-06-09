import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';


const TWENTY_FIVE_MINS_IN_MILISECONDS = 1500000;
const FIVE_MINS_IN_MILISECONDS = 300000;
let startStopButton;
let beepToBePlayed;
let mockPlay;
let mockPause;

beforeEach(() => {
  jest.useFakeTimers();

  render(<App />);

  startStopButton = screen.getByRole('button',{name: "Start/stop clock"});
  beepToBePlayed = screen.getByTestId('beep');

  mockPlay = jest.spyOn(beepToBePlayed, 'play').mockImplementation(() => {});
  mockPause = jest.spyOn(beepToBePlayed, 'pause').mockImplementation(() => {});

});

afterEach(() => {
  //cleanup functions
  mockPlay.mockRestore();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
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
  let previousTimeLeft;
  let currentTimeLeft;
  //start the clock
  //advance the timer
  //check if the time-left has changed
  previousTimeLeft = screen.getByTestId('time-left').textContent;

  await userEvent.click(startStopButton);

  act(() => { jest.advanceTimersByTime(getRandomTime()) });

  currentTimeLeft = screen.getByTestId('time-left').textContent;

  expect(currentTimeLeft).not.toEqual(previousTimeLeft);

  //stop clock
  //advance the timer
  //check if the time-left has not changed
  previousTimeLeft = screen.getByTestId('time-left').textContent;

  await userEvent.click(startStopButton);

  act(() => { jest.advanceTimersByTime(getRandomTime()) });

  currentTimeLeft = screen.getByTestId('time-left').textContent;

  expect(currentTimeLeft).toEqual(previousTimeLeft);

  //resume clock
  //advance the timer
  //check if the time-left has changed
  previousTimeLeft = screen.getByTestId('time-left').textContent;

  await userEvent.click(startStopButton);

  act(() => { jest.advanceTimersByTime(getRandomTime()) });

  currentTimeLeft = screen.getByTestId('time-left').textContent;

  expect(currentTimeLeft).not.toEqual(previousTimeLeft);

});

//return a random time between 1s and 59s in miliseconds
getRandomTime = () => {
  return Math.floor((Math.random() * 59000) + 1000);
}

it( 'should start a break and play a beep when the session ends', async () => {
  await userEvent.click(startStopButton);

  //Advance the timer by 25mins
  act(() => { jest.advanceTimersByTime(TWENTY_FIVE_MINS_IN_MILISECONDS); } );

  expect(screen.getByRole('heading',{name: "Break"})).toBeInTheDocument();
  expect(mockPlay).toHaveBeenCalledTimes(1);

  const currentTimeLeft = screen.getByTestId('time-left').textContent;
  // Get the minutes part of the display
  // Cast to number to remove any 0 in the beginning
  const minutesLeft = Number(currentTimeLeft.split(':')[0]);
  const breakLength = Number(screen.getByTitle('Break length in minutes').textContent);

  expect(minutesLeft).toEqual(breakLength);

});

it('should start a session and play a beep when the break ends', async () =>{
  await userEvent.click(startStopButton);

  //Advance the timer by 25mins + 5mins (session + break)
  act(() => { jest.advanceTimersByTime(TWENTY_FIVE_MINS_IN_MILISECONDS); } );
  //TODO analyze why this have to be done in two times
  act(() => { jest.advanceTimersByTime(FIVE_MINS_IN_MILISECONDS); } );

  expect(screen.getByRole('heading',{name: "Session"})).toBeInTheDocument();
  //one beep for the end of the session and other for the end of the break
  expect(mockPlay).toHaveBeenCalledTimes(2);

   const currentTimeLeft = screen.getByTestId('time-left').textContent;
  // Get the minutes part of the display
  // Cast to number to remove any 0 in the beginning
  const minutesLeft = Number(currentTimeLeft.split(':')[0]);
  const sessionLength = Number(screen.getByTitle('Session length in minutes').textContent);

  expect(minutesLeft).toEqual(sessionLength);

});

it('should reset the controls when clicking in the reset button', async () => {
  //decrement session and break length to check if they're going to reset
  const decrementSessionLength =
      screen.getByRole('button',{name: "Decrement session length"});

  await userEvent.click(decrementSessionLength);

  const decrementBreakLength =
      screen.getByRole('button',{name: "Decrement break length"});

  await userEvent.click(decrementBreakLength);

  const resetButton = screen.getByRole('button',{name: "Reset clock"});

  await userEvent.click(resetButton);

  checkClock();

  //increment session and break length by 1 to check if they're going to reset
  const incrementSessionLength =
      screen.getByRole('button',{name: "Increment session length"});

  await userEvent.click(incrementSessionLength);

  const incrementBreakLength =
      screen.getByRole('button',{name: "Increment break length"});

  await userEvent.click(incrementBreakLength);

  await userEvent.click(resetButton);

  checkClock();

});

//verifies if the clock is in its default state
checkClock = () => {
  const sessionLength= screen.getByTitle('Session length in minutes');
  expect(sessionLength).toHaveTextContent(/^25$/);

  const breakLength= screen.getByTitle('Break length in minutes');
  expect(breakLength).toHaveTextContent(/^5$/);

  const sessionLabel = screen.getByRole('heading',{level: 2, name: "Session"});
  expect(sessionLabel).toBeInTheDocument();

  const timeLeft = screen.getByTestId('time-left');
  expect(timeLeft).toHaveTextContent(/^25:00$/);
}

it('should stop the session and reset the controls when clicking in reset',
  async () => {
    await userEvent.click(startStopButton);

    //advance the timer
    act(() => { jest.advanceTimersByTime(getRandomTime()) });

    const resetButton = screen.getByRole('button',{name: "Reset clock"});

    await userEvent.click(resetButton);

    checkClock();

});


it('should stop the break and reset the controls when clicking in reset',
  async () => {
    await userEvent.click(startStopButton);

    //advance the timer in 25 minutes to start a break
    act(() => { jest.advanceTimersByTime(TWENTY_FIVE_MINS_IN_MILISECONDS) });
    //advance the timer
    //TODO analyze why this have to be done in two times
    act(() => { jest.advanceTimersByTime(getRandomTime()) });

    //assure that we are in a break
    const sessionLabel = screen.getByRole('heading',{level: 2, name: "Break"});
    expect(sessionLabel).toBeInTheDocument();

    const resetButton = screen.getByRole('button',{name: "Reset clock"});

    await userEvent.click(resetButton);

    checkClock();

});
