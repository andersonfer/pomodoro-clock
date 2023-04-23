import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';

export const MAX_LENGTH_IN_MINUTES = 60;
export const MIN_LENGTH_IN_MINUTES = 1;

export const DEFAULT_BREAK_LENGTH = 5;
export const DEFAULT_SESSION_LENGTH = 25;

const ONE_SECOND_IN_MILISECONDS = 1000;

export default function App(){
  const [breakLength, setBreakLength] = useState(DEFAULT_BREAK_LENGTH);
  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION_LENGTH);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isClockPaused, setIsClockPaused] = useState(true);
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(DEFAULT_SESSION_LENGTH * 60);

  const beepRef = useRef(null);
  const intervalRef = useRef(null);

  //when the clock reaches 00:00
  //either start a session or a break
  if(timeLeftInSeconds === 0) {
    if(isSessionActive){
      //start a break
      setTimeLeftInSeconds(breakLength * 60);
      setIsSessionActive(false);
    } else {
      //start a session
      setTimeLeftInSeconds(sessionLength * 60);
      setIsSessionActive(true);
    }
    //play a beep
    beepRef.current.play();
  }

  //start,stop and resume the clock
  useEffect(() => {

    if(!isClockPaused)
      intervalRef.current = setInterval(() => {
        if(timeLeftInSeconds > 0)
          setTimeLeftInSeconds(t => t - 1);
      }, ONE_SECOND_IN_MILISECONDS);
    else
      clearInterval(intervalRef.current);

    return () => clearInterval(intervalRef.current);

  },[isClockPaused,timeLeftInSeconds]);


  const getFormattedTimeLeft = () => {
    const seconds = timeLeftInSeconds % 60;
    const minutes = Math.floor(timeLeftInSeconds/60);

    const formattedMinutesLeft =
            minutes.toLocaleString(undefined, {minimumIntegerDigits: 2});

    const formattedSecondsLeft =
            seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});

    const formattedTimeLeft = formattedMinutesLeft + ":" + formattedSecondsLeft;

    return formattedTimeLeft;
  };


  const resetClock = () => {
    setSessionLength(DEFAULT_SESSION_LENGTH);
    setBreakLength(DEFAULT_BREAK_LENGTH)
    setIsSessionActive(true);
    setTimeLeftInSeconds(DEFAULT_SESSION_LENGTH * 60);
    setIsClockPaused(true);
    resetBeep();
  };

  const resetBeep = () => {
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };


  const updateLength = (type, operation) => {
    let currentLenght = type === 'sessionLength' ?
                        sessionLength :
                        breakLength;
    let newLength;

    if(operation === 'increment'){
      newLength = currentLenght < MAX_LENGTH_IN_MINUTES ?
                  currentLenght + 1 :
                  currentLenght

    } else if (operation === 'decrement'){
      newLength = currentLenght > MIN_LENGTH_IN_MINUTES ?
                  currentLenght - 1 :
                  currentLenght
    }

    if(type === 'sessionLength'){
      setSessionLength(newLength);

      if(isSessionActive && isClockPaused){
        setTimeLeftInSeconds(newLength * 60);
      }

    } else if (type === 'breakLength'){
      setBreakLength(newLength);

      if(!isSessionActive && isClockPaused){
        setTimeLeftInSeconds(newLength * 60);
      }
    }
  };

  return (
    <>
      <div id="header">
        <h1 id="title">Pomodoro Clock</h1>
        <div id="clock-setup">
          <div id="session-setup" className="flex-center">
            <h3 id="session-label">
              Session Length
            </h3>
            <div>
              <button
                id="session-decrement"
                title="Decrement session length"
                onClick={() => updateLength('sessionLength','decrement')}
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <span id="session-length" title="Session length in minutes">{sessionLength}</span>
              <button
                id="session-increment"
                title="Increment session length"
                onClick={() => updateLength('sessionLength','increment')}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
          <div id="break-setup" className="flex-center">
            <h3 id="break-label">
              Break Length
            </h3>
            <div>
              <button
                id="break-decrement"
                title="Decrement break length"
                onClick={() => updateLength('breakLength','decrement')}
              >
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <span id="break-length" title="Break length in minutes">{breakLength}</span>
              <button
                id="break-increment"
                title="Increment break length"
                onClick={() => updateLength('breakLength','increment')}
              >
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="clock">
        <div id="clock-display" className="flex-center">
          <h2 id="timer-label">{isSessionActive ? "Session" : "Break"}</h2>
          <div id="time-left" data-testid="time-left">{getFormattedTimeLeft()}</div>
        </div>
        <div id="clock-controls">
          <button id="start_stop" title="Start/stop clock" onClick={()=> setIsClockPaused(!isClockPaused)}>
            <i className="fa-solid fa-play"></i>
            <i className="fa-solid fa-pause"></i>
          </button>
          <button id="reset" title="Reset clock" onClick={resetClock}>
            <i className="fa-sharp fa-solid fa-repeat"></i>
          </button>
          <audio id="beep" ref={beepRef} src="https://cdn.pixabay.com/download/audio/2023/01/06/audio_43c9ef7336.mp3?filename=achive-sound-132273.mp3" data-testid="beep"/>
        </div>
      </div>

      <footer>Designed and coded by @andersonfer</footer>
    </>
  );
}
