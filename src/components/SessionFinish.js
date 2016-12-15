import React from 'react';
import VerticalCenter from './VerticalCenter';
import utils from './utils/utils.js';

import './SessionFinish.css';

const SessionFinish = ({sessionWork, sessionBreak, todayWork, todayBreak, handleStartAnother}) => {
  const delays=[];
  for (let i=1; i <= 3; i++) {
    delays.push({transitionDelay: 40 * i + 'ms'});
  }
  let textContents =  [
    <div className="header textChild" key="text0"><h2 className="header">Session Complete</h2></div>,
    <div style={delays[0]}  className="textChild" key="text1"><p>You just worked <span className="work-time">{utils.secondsToTimeString(sessionWork)}</span>,<br />
    and breaked <span className="break-time">{utils.secondsToTimeString(sessionBreak)}</span>.</p></div>,
    <div style={delays[1]} key="text2" className="textChild"><p>Today you've worked <span className="work-time">{utils.secondsToTimeString(todayWork)}</span>,<br />
    and breaked <span className="break-time">{utils.secondsToTimeString(todayBreak)}</span></p></div>,
    <a onClick={handleStartAnother} style={delays[2]} className="button textChild"  key="text3"  >Start Another</a>
  ];

  return (
    <VerticalCenter front={true}>
      <div className="session-finish">
        {textContents}
      </div>
    </VerticalCenter>
  );
}

export default SessionFinish;
