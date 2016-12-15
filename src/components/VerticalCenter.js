import React from 'react';
import './VerticalCenter.css';

const VerticalCenter = (props) => {
  let zStyle = {
    zIndex: 1
  };
  if (props.front) {
    zStyle.zIndex = 100;
  }
  return (
    <div className="vertical-center" style={zStyle}>
      <div className="vertical-center-inner">
        {props.children}
      </div>
    </div>
  );
}

export default VerticalCenter;
