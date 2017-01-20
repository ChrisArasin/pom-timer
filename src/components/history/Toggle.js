import React from 'react';
import './Toggle.css';

const Toggle = ({b1Text, b2Text, b1Click, b2Click, buttonOn}) => {
  return (
    <div className="toggle">
      <button onClick={b1Click} className={buttonOn === 1 ? "on button1" : "button1" }>{b1Text}</button>
      <button onClick={b2Click} className={buttonOn === 2 ? "on button2" :  "button2" }>{b2Text}</button>
    </div>
  );
}

export default Toggle;
