let utils = {};
utils.secondsToTimeString = (origSeconds) => {
  const hours = Math.floor(origSeconds / 3600);
  const secondsMinusHours = origSeconds - hours * 3600;
  let minutes = Math.floor(secondsMinusHours / 60);
  let seconds = secondsMinusHours - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

utils.secondsToHoursMins = (origSeconds) => {
  const hours = Math.floor(origSeconds / 3600);
  const secondsMinusHours = origSeconds - hours * 3600;
  let minutes = Math.floor(secondsMinusHours / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}

export default utils;
