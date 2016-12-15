import React from 'react';
import DisplayDate from './DisplayDate';
import utils from '../utils/utils';
import './Bar.css';

const Bar = ({ data, maxTime, breakFirst, normalize, index, totalRows }) => {

  const width = 300;
  let delayMultiplier = 300;
  if (totalRows < 15) {
    delayMultiplier = 200;
  }

  let wrapperStyle = {
    transitionDelay: index / totalRows * delayMultiplier + 'ms'
  };

  let workWidthStyle = {
    width: '1px',
    transitionDelay: index / totalRows * delayMultiplier + 'ms'
  };
  let breakWidthStyle = {
    width: '1px',
    transitionDelay: index / totalRows * delayMultiplier + 'ms'
  }

  if (! normalize) {
    workWidthStyle.transform = 'scaleX(' + data.workTime / maxTime * width + ')';
    breakWidthStyle.transform = 'scaleX(' + data.breakTime / maxTime  * width + ')';
    if (breakFirst) {
      workWidthStyle.transform = 'translateX(' + data.breakTime / maxTime  * width + 'px) ' + workWidthStyle.transform;
    } else {
      breakWidthStyle.transform = 'translateX(' + data.workTime / maxTime  * width + 'px) ' + breakWidthStyle.transform;
    }
  } else {
    const totalTime = data.workTime + data.breakTime;
    workWidthStyle.transform =  'scaleX(' + data.workTime / totalTime * width + ')';
    breakWidthStyle.transform = 'scaleX(' + data.breakTime / totalTime  * width + ')';
    if (breakFirst) {
      workWidthStyle.transform = 'translateX(' + data.breakTime / totalTime  * width + 'px) ' + workWidthStyle.transform;
    } else {
      breakWidthStyle.transform = 'translateX(' + data.workTime / totalTime  * width + 'px) ' + breakWidthStyle.transform;
    }
  }

  return (
    <div className="bar-wrap" style={wrapperStyle}>
      <div className="bar-data">
        <DisplayDate date={data.date} endDate={data.endDate ? data.endDate : null} />
        <span className="bar-work-time bar-text">{utils.secondsToHoursMins(data.workTime)}</span>
        <span className="bar-break-time bar-text">{utils.secondsToHoursMins(data.breakTime)}</span>
        <span className="bar-ratio bar-text">{Math.round(data.ratio * 100) / 100}:1</span>
      </div>
      <div className="history-bar">
        <div className="bar work-bar" style={workWidthStyle} />
        <div className="bar break-bar" style={breakWidthStyle} />
      </div>
    </div>
  );
}

export default Bar;
