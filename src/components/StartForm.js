import React from 'react';
import VerticalCenter from './VerticalCenter';
import './StartForm.css';

const StartForm = (props) => {

  const minWidthStyle = {width: props.setWorkMinutes.toString().length * 22 + 'px'},
        breakWidthStyle = {width: props.setBreakMinutes.toString().length * 22 + 'px'},
        setNumTimesWidthStyle = {width: props.setNumTimes.toString().length * 22 + 'px'};

  const minInput = <input style={minWidthStyle} onChange={(e)=>{props.handleChange('setWorkMinutes', e)}} type="text" value={props.setWorkMinutes} className="input work-mins" />;
  const breakInput = <input style={breakWidthStyle} onChange={(e)=>{props.handleChange('setBreakMinutes', e)}} type="text" value={props.setBreakMinutes} className="input break-mins" />;
  const setNumTimesInput = <input style={setNumTimesWidthStyle} onChange={(e)=>{props.handleChange('setNumTimes', e)}} type="text" value={props.setNumTimes} className="input num-times" />;

  //calculate display time
  let totalMins = ((props.setWorkMinutes + props.setBreakMinutes ) * props.setNumTimes) - props.setBreakMinutes;
  if (totalMins < 0) {
    totalMins = 0;
  }
  const hours = Math.floor(totalMins / 60);
  let finalMins = totalMins - hours * 60;
  if (finalMins < 10) {
    finalMins = '0' + finalMins;
  }
  const displayTime = hours + ":" + finalMins;

  const delays=[];
  for (let i=1; i <= 3; i++) {
    delays.push({transitionDelay: 40 * i + 'ms'});
  }

  let formContents =  [
    <div className="formChild" key="form0"><h2 className="form-header">Start a Session</h2></div>,
    <div style={delays[0]}  key="form1" className="formChild"><p>I will work in uninterrupted<br />periods of {minInput} minutes, with breaks<br /> of {breakInput} minutes. I'll do this {setNumTimesInput} time{props.setNumTimes !== 1 ? 's' : null}.</p></div>,
    <div style={delays[1]}  key="form2" className="formChild"><p>It will take <span className="form-total">{displayTime}</span></p></div>,
    <div key="form3" className="formChild" style={delays[2]}><input type="submit" value="Pomodo it" /></div>
  ];

  return (
    <VerticalCenter front={true}>
      <div className="start-form-wrap">
          <form onSubmit={props.handleSubmit} className="start-form">
            {formContents}
          </form>
      </div>
    </VerticalCenter>
  );

}

export default StartForm;
