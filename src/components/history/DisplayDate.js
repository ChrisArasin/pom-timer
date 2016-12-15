import React from 'react';
import './DisplayDate.css';

const DisplayDate = ({ date, endDate }) => {
  const month1 = date.getMonth() + 1,
        day1 = date.getDate();

  let month2, day2;

  if (endDate) {
    month2 =  endDate.getMonth() + 1;
    day2 = endDate.getDate();
  }


  let dateString;
  if (endDate && day1 !== day2) {
     dateString = month1 + '/' + day1 + '-' + month2 + '/' + day2;
  } else {
     dateString = month1 + '/' + day1;
  }
  return <div className="bar-date date-range  bar-text">{dateString}</div>;
}

export default DisplayDate;
