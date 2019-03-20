// #########################################################################
// ELEMENTS' DEFINITIONS...
// #########################################################################

// Buttons - RESET, START/STOP
const reset = document.querySelector('#reset');
const startStop = document.querySelector('#start_stop');
const startButton = startStop.querySelector('#startButton');
const stopButton = startStop.querySelector('#stopButton');

// Timer - label with actual state (session/break) and time left
const timerLabel = document.querySelector('#timer-label');
const timeLeft = document.querySelector('#time-left');

// Break length adjustements
const breakLabel = document.querySelector('#break-label');
const breakLength = document.querySelector('#break-length');
const adjustTime = document.querySelector('#adjust-time');

// Session length adjustements
const sessionLabel = document.querySelector('#session-label');
const sessionLength = document.querySelector('#session-length');

// All time-changing buttons (increment/decrement)
const changeTimeButtons = document.querySelectorAll('.change-time');

// Audio file
const beep = document.querySelector('#beep');

// Update time
const updateTime = () => timeLeft.innerText = setTime.time;

// Left-pad function for displaying time with leading zeros
const leftPad = num => ('0' + num).slice(-2);




// #########################################################################
// SET TIME - GETTERS AND SETTERS
// #########################################################################

const setTime = {
  _minutes : 25,
  _seconds : 0,

  set minutes(value) {
    this._minutes = Number(value);
  },

  set seconds(value) {
    this._seconds = Number(value);
  },

  get minutes() {
    return this._minutes;
  },

  get seconds() {
    return this._seconds;
  },

  get time() {
    return `${leftPad(this.minutes)}:${leftPad(this.seconds)}`
  }
};





// *************************************************************************
// CHANGE TIME - INCREMENTATION/DECREMENTATION
// *************************************************************************

changeTimeButtons.forEach(button => button.addEventListener('click', changeTime));

function changeTime(event) {
  const button = event.target.closest('button');
  const lengthOfTime = button.parentNode.querySelector('.length');
  const action = button.dataset.action;
  let time = Number(lengthOfTime.innerText);

  if (action === 'increment' && time < 60) {
    time++;
  };

  if (action === 'decrement' && time > 1) {
    time--;
  };

  lengthOfTime.innerText = time;

  setTime.seconds = 0;
  setTime.minutes = sessionLength.innerText;
  updateTime();
}





// *************************************************************************
// RESET - COME BACK TO DEFAULT VALUES (session 25min, break 5min)
// *************************************************************************

function resetTime() {
  setTime.minutes = 25;
  setTime.seconds = 0;
  breakLength.innerText = 5;
  sessionLength.innerText = 25;
  updateTime();
  adjustTime.style.opacity = 1;
};

function resetStartButton() {
  startStop.dataset.action = 'start';
  stopButton.style.display = 'none';
  startButton.style.display = 'block';
};

function resetTimerLabel() {
  timerLabel.dataset.phase = 'session';
  timerLabel.innerText = 'SESSION';
};

function resetBeeper() {
  beep.pause();
  beep.currentTime = 0;
};

reset.addEventListener('click', function changeToDefault(event) {
  clearInterval(countingDown);
  resetBeeper();
  resetTime();
  resetStartButton();
  resetTimerLabel();
  changeTimeButtons.forEach(button => button.disabled = false);
  startStop.parentNode.classList.remove('running');
});




// *************************************************************************
// BREAK/SESSION CHANGE
// *************************************************************************

function toggleBreakSession() {
  const currentPhase = timerLabel.dataset.phase;
  const nextPhase = currentPhase === 'session' ? 'break' : 'session';

  timerLabel.dataset.phase = nextPhase;

  const {newLabel, newTime} = nextPhase === 'session'
    ? {newLabel : 'SESSION', newTime : sessionLength.innerText}
    : {newLabel : 'BREAK', newTime : breakLength.innerText};

  timerLabel.innerText = newLabel;
  setTime.minutes = newTime;

  updateTime();
};




// *************************************************************************
// FINAL COUNTDOWN :)
// *************************************************************************

function finalCountDown() {
  if (setTime.seconds > 0) {
    setTime.seconds = setTime.seconds - 1;
  }
  else if (setTime.seconds === 0 && setTime.minutes > 0) {
    setTime.minutes = setTime.minutes - 1;
    setTime.seconds = 59;
  }
  else if (setTime.seconds === 0 && setTime.minutes === 0) {
    beep.play();
    toggleBreakSession();
  }
};




// *************************************************************************
// START_STOP BUTTON IS CHANGING ON CLICK
// *************************************************************************

startStop.addEventListener('click', startStopTimer);
var countingDown;

function startStopTimer(event) {
  let action = startStop.dataset.action;
  let start;
  let remaining = 1000;

  if (action === 'start') {
    startStop.parentNode.classList.add('running');
    stopButton.style.display = 'block';
    startButton.style.display = 'none';
    adjustTime.style.opacity = 0;
    clearInterval(countingDown);
    start = new Date();
    countingDown = setInterval(pomodoro, remaining);
    changeTimeButtons.forEach(button => button.disabled = true);
  }

  if (action === 'pause') {
    startStop.parentNode.classList.remove('running');
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    adjustTime.style.opacity = 1;
    clearInterval(countingDown);
    remaining -= new Date() - start;
    changeTimeButtons.forEach(button => button.disabled = false);
  }

 startStop.dataset.action = action === 'start' ? 'pause' : 'start';
}




// *************************************************************************
// *waving with wand* POMODORO! WORK!
// *************************************************************************

function pomodoro() {
  finalCountDown();
  updateTime();
}
