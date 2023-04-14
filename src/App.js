import React from 'react';
import './App.css';


export const MAX_LENGTH_IN_MINUTES = 60;
export const MIN_LENGTH_IN_MINUTES = 1;
const FIFTY_NINE_SECONDS = 59;
const ONE_SECOND_IN_MILISECONDS = 1000;
export const DEFAULT_BREAK_LENGTH = 5;
export const DEFAULT_SESSION_LENGTH = 25;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: DEFAULT_BREAK_LENGTH,
      sessionLength: DEFAULT_SESSION_LENGTH
    };
  }

  componentDidMount() {
    document.addEventListener("resetClock", () => {
      this.resetSetup();
    });
  }

  resetSetup = () => {
    this.setState({
      breakLength: DEFAULT_BREAK_LENGTH,
      sessionLength: DEFAULT_SESSION_LENGTH
    });
    this.dispatchNewSessionLength(DEFAULT_SESSION_LENGTH);
  };

  render() {
    return (
      <>
        <div id="header">
          <h1 id="title">Pomodoro Clock</h1>
          <div id="clock-setup">
            <SessionSetup
              sessionLength={this.state.sessionLength}
              incrementFnc={this.incrementSessionLength}
              decrementFnc={this.decrementSessionLength}
            />
            <BreakSetup
              breakLength={this.state.breakLength}
              incrementFnc={this.incrementBreakLength}
              decrementFnc={this.decrementBreakLength}
            />
          </div>
        </div>

        <div id="clock">
          <Clock
            sessionLength={this.state.sessionLength}
            breakLength={this.state.breakLength}
          />
        </div>

        <footer>Designed and coded by @andersonfer</footer>
      </>
    );
  }

  incrementBreakLength = () => {
    this.setState((state) => ({
      breakLength:
        this.state.breakLength < MAX_LENGTH_IN_MINUTES
          ? this.state.breakLength + 1
          : this.state.breakLength
    }));
    //this.dispatchBreakUpdatedEvent();
  };

  decrementBreakLength = () => {
    this.setState((state) => ({
      breakLength:
        this.state.breakLength > MIN_LENGTH_IN_MINUTES
          ? this.state.breakLength - 1
          : this.state.breakLength
    }));
    //this.dispatchBreakUpdatedEvent();
  };

  incrementSessionLength = () => {
    const newSessionLength =
      this.state.sessionLength < MAX_LENGTH_IN_MINUTES
        ? this.state.sessionLength + 1
        : this.state.sessionLength;
    this.setState((state) => ({
      sessionLength: newSessionLength
    }));
    this.dispatchNewSessionLength(newSessionLength);
  };

  decrementSessionLength = () => {
    const newSessionLength =
      this.state.sessionLength > MIN_LENGTH_IN_MINUTES
        ? this.state.sessionLength - 1
        : this.state.sessionLength;
    this.setState((state) => ({
      sessionLength: newSessionLength
    }));
    this.dispatchNewSessionLength(newSessionLength);
  };

  dispatchNewSessionLength = (newSessionLength) => {
    const sessionUpdatedEvent = new CustomEvent("sessionUpdated", {
      detail: {
        newSessionLength: newSessionLength
      }
    });
    document.dispatchEvent(sessionUpdatedEvent);
  };
}

class SessionSetup extends React.Component {
  render() {
    return (
      <div id="session-setup" className="flex-center">
        <h3 id="session-label">
          Session Length
        </h3>
        <div>
          <button
            id="session-decrement"
            title="Decrement session length"
            onClick={this.props.decrementFnc}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <span id="session-length" title="Session length in minutes">{this.props.sessionLength}</span>
          <button
            id="session-increment"
            title="Increment session length"
            onClick={this.props.incrementFnc}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </div>
    );
  }
}

class BreakSetup extends React.Component {
  render() {
    return (
      <div id="break-setup" className="flex-center">
        <h3 id="break-label">
          Break Length
        </h3>
        <div>
          <button
            id="break-decrement"
            title="Decrement break length"
            onClick={this.props.decrementFnc}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <span id="break-length" title="Break length in minutes">{this.props.breakLength}</span>
          <button
            id="break-increment"
            title="Increment break length"
            onClick={this.props.incrementFnc}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </div>
    );
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: this.props.sessionLength,
      seconds: 0,
      isClockPaused: true,
      hasBreakStarted: false
    };
  }

  componentDidMount() {
    document.addEventListener("sessionUpdated", (e) => {
      this.updateTimeLeft(e);
    });
  }

  updateTimeLeft = (e) => {
    if (this.isSessionRunning()){
      //ToDo extract method
      const newSessionLength = e.detail.newSessionLength;
      this.setState({
        minutes: newSessionLength,
        seconds: 0
      });
    }//ToDo break treatment
  };

  isSessionRunning = () => {
    return !this.state.hasBreakStarted;
  }

  componentDidUpdate() {
    if (this.timerHasReachedZero()) {
      this.stopClock();
      this.playBeep();
      //TODO this is a hack, must find another way of staying in zero
      setTimeout(this.startSessionOrBreak,1000);
    }
  }

  playBeep = () => {
    document.getElementById("beep").play();
  }

  timerHasReachedZero = () => {
    return (
      this.state.minutes === 0 &&
      this.state.seconds === 0 &&
      !this.state.isClockPaused
    );
  };

  startSessionOrBreak = () => {
    if (this.state.hasBreakStarted) {
        this.startSession();
      } else {
        this.startBreak();
      }
  }

  startSession = () => {
    this.setState({
      hasBreakStarted: false,
      minutes: this.props.sessionLength,
      seconds: 0
    });
    this.resumeClock();
  };

  startBreak = () => {
    this.setState({
      hasBreakStarted: true,
      minutes: this.props.breakLength,
      seconds: 0
    });
    this.resumeClock();
  };

  render() {
    return (
      <>
        <ClockDisplay
          label={this.state.hasBreakStarted ? "Break" : "Session"}
          minutes={this.state.minutes}
          sessionLength={this.props.sessionLength}
          seconds={this.state.seconds}
          startStopFnc={this.startStopClock}
          resetFnc={this.resetClock}
        />
      </>
    );
  }

  startStopClock = () => {
    if (this.state.isClockPaused) {
      this.resumeClock();
    } else {
      this.stopClock();
    }
  };

  clockID;
  resumeClock = () => {
    this.setState({ isClockPaused: false });
    this.clockID = setInterval(this.updateClock, ONE_SECOND_IN_MILISECONDS);
  };

  updateClock = () => {
    this.setState((state) => ({
      minutes:
        state.minutes > 0 && state.seconds === 0
          ? state.minutes - 1
          : state.minutes,
      seconds:
          state.seconds === 0
          ? FIFTY_NINE_SECONDS
          : state.seconds - 1
    }));
  };

  stopClock = () => {
    this.setState({
      isClockPaused: true
    });
    clearInterval(this.clockID);
  };

  resetClock = () => {
    this.setState({
      hasBreakStarted: false
    });
    this.stopClock();
    this.resetBeep();
    this.dispatchResetClockEvent();
  };

  resetBeep = () => {
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }

  dispatchResetClockEvent = () => {
    const resetClockEvent = new CustomEvent("resetClock");
    document.dispatchEvent(resetClockEvent);
  };
}

class ClockDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0
    };
  }

  render() {
    return (
      <>
        <div id="clock-display" className="flex-center">
          <h2 id="timer-label">{this.props.label}</h2>
          <div id="time-left" data-testid="time-left">{this.getFormattedTimeLeft()}</div>
        </div>
        <div id="clock-controls">
          <PlayStopButton resumeOrPauseClock={this.props.startStopFnc} />
          <ResetButton resetClock={this.props.resetFnc} />
          <audio id="beep" src="https://cdn.pixabay.com/download/audio/2023/01/06/audio_43c9ef7336.mp3?filename=achive-sound-132273.mp3"/>
        </div>
      </>
    );
  }

  getFormattedTimeLeft = () => {
    const formattedMinutesLeft = this.props.minutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2
    });
    const formattedSecondsLeft = this.props.seconds.toLocaleString(undefined, {
      minimumIntegerDigits: 2
    });
    const formattedTimeLeft = formattedMinutesLeft + ":" + formattedSecondsLeft;
    return formattedTimeLeft;
  };
}

class PlayStopButton extends React.Component {
  render() {
    return (
      <button
        id="start_stop"
        title="Start/stop clock"
        onClick={this.props.resumeOrPauseClock}
      >
        <i className="fa-solid fa-play"></i>
        <i className="fa-solid fa-pause"></i>
      </button>
    );
  }
}

class ResetButton extends React.Component {
  render() {
    return (
      <button id="reset" title="Reset clock" onClick={this.props.resetClock}>
        <i className="fa-sharp fa-solid fa-repeat"></i>
      </button>
    );
  }
}

export default App;
