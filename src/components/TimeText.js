import React from 'react';
import './TimeText.css';

const TimeText = ({elapsedSeconds, gap, sessionMinutes, status, breaking}) => {

  let numMinutes, numSeconds, styles, timeDisplayText, timeToFormat, topSpace,
  classes = '';
  const topSpacer = 8;

  if (elapsedSeconds <= sessionMinutes * 60) {
    timeToFormat = sessionMinutes * 60 - elapsedSeconds;
    numMinutes = Math.floor(timeToFormat / 60);
    numSeconds = timeToFormat - (numMinutes * 60);
    topSpace = (sessionMinutes - numMinutes) * gap + topSpacer;
    //spacing fix for when elapsedSeconds = 0
    if (numMinutes === sessionMinutes) {
      topSpace =  gap + topSpacer;
    }
  } else {
     timeToFormat = elapsedSeconds - (sessionMinutes * 60);
     numMinutes = Math.floor(timeToFormat / 60);
     numSeconds = timeToFormat - (numMinutes * 60);
     const numMinuteRows = Math.floor((timeToFormat - 1) / 60);
     topSpace = (sessionMinutes + numMinuteRows + 1) * gap + topSpacer + gap; //extra gap space for extra line
     classes = "over-time";
  }

  //display 1 minute as :01, not :1
  if (numSeconds < 10) {
    numSeconds = "0" + numSeconds;
  }

  if (breaking) {
    classes += ' breaking';
  }

  styles = {
    left: gap - 4,
    transform: 'translateY(' + topSpace + 'px)'
  }

  timeDisplayText = elapsedSeconds <= sessionMinutes * 60 ? numMinutes + ":" + numSeconds : "+" + numMinutes + ":" + numSeconds;

  if (status === "switching") {
    classes += " switching";
    styles.transform += ' scale(1.1)';
  }
  if (status === "reset") {
    classes += " reset";
    const newTop = gap + topSpacer;
    styles.transform = 'translateY(' + newTop + 'px) scale(1.1)';
  }
  return <p style={styles} className={classes} id="time-text" >{timeDisplayText}</p>;
}

export default TimeText;
