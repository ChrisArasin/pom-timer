import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({totalWork, totalBreak, totalTime, width, margin, status, barUpdate}) => {
  const outerBarStyle = {
    width: width + 'px'
  };

  let workWidthStyle = { width: '1px', opacity: 0 }
  let breakWidthStyle = { width: '1px', opacity: 0 }
  let denominator = totalTime;
  
  if (totalWork + totalBreak > totalTime) {
    denominator = totalWork + totalBreak
  }

  if (totalWork + totalBreak > 0) {
    workWidthStyle = {
      width: '1px',
      transform: 'scaleX(' + totalWork / denominator * width + ')'
    }
    breakWidthStyle = {
      width: '1px',
      transform: 'translateX(' + totalWork / denominator  * width + 'px)' +
                 'scaleX(' + totalBreak / denominator  * width + ')'
    };
  }

  let outerClasses = 'progress-bar';
  if (barUpdate) {
    outerClasses += ' on';
  }

  return (
    <div className={outerClasses} style={outerBarStyle}>
      <div className="bar work-bar" style={workWidthStyle} />
      <div className="bar break-bar" style={breakWidthStyle} />
      <div className="bk-bar" />
    </div>
  );
}

export default ProgressBar;
