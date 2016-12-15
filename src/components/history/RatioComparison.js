import React from 'react';

const RatioComparison = ({thisWeek, compWeek, label}) => {
  const compRatio = Math.round((thisWeek - compWeek) / compWeek * 10000) / 100;
  let element;
  if (compRatio > 0) {
    element = <span className="positive">+{compRatio}%</span>
  } else if ( compRatio < 0) {
    element = <span className="negative">{compRatio}%</span>
  } else {
    element = <span>{compRatio}%</span>
  }
  return <div className="history-comp">{label} {element}</div>;
}

export default RatioComparison;
