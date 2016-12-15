export const saveDataToStorage = (dataToSave) => {
  const dataToParse = dataToSave.map((d)=>(Object.assign({}, d)));
  dataToParse.forEach((d)=>{
    d.date = d.date.getTime();
  });
  localStorage.setItem('data', JSON.stringify(dataToParse));
}

export const saveSampleData = ()=> {
  // create some fake data
  var historyData = [];
  for(var i = 0; i < 31; i++) {
    historyData.push({
      date: new Date(2016, 9, i + 1),
      workTime: Math.floor((Math.random() * 4 + 4 ) * 60 * 60), //seconds
      breakTime: Math.floor((Math.random() * 1.2  + 1 ) * 60 * 60) //seconds
    })
  };
  for(i = 0; i < 2; i++) {
    historyData.push({
      date: new Date(2016, 10, i + 1),
      workTime: Math.floor((Math.random() * 6 + 4.25 ) * 60 * 60), //seconds
      breakTime: Math.floor((Math.random() + .8 ) * 60 * 60) //seconds
    })
  };
  saveDataToStorage(historyData);
}

export const getDataFromStorage = () => {
  let currentData = localStorage.getItem('data');
  if (currentData) {
    const parsedData = JSON.parse(currentData);
    parsedData.forEach((d)=>{
      d.date = new Date(d.date);
    });
    return parsedData;
  }
  return false;
}
export const getWorkSettingFromStorage = () => {
  return parseInt(localStorage.getItem('workMinutes'), 10);
}
export const saveWorkSettingToStorage = (newSetting) => {
  localStorage.setItem('workMinutes', newSetting);
}
export const getBreakSettingFromStorage = () => {
  return parseInt(localStorage.getItem('breakMinutes'), 10);
}
export const saveBreakSettingToStorage = (newSetting) => {
  localStorage.setItem('breakMinutes', newSetting);
}
export const getTimesSettingFromStorage = () => {
  return parseInt(localStorage.getItem('numTimes'), 10);
}
export const saveTimesSettingToStorage = (newSetting) => {
  localStorage.setItem('numTimes', newSetting);
}

//group day data by week, used by history
export const getWeekData = (dayData) => {
  let weekData = [];
  dayData.sort((prev, next)=>{
    return prev.date.getTime() - next.date.getTime();
  });
  weekData.push( Object.assign({}, dayData[0]));
  let weekCount = 0;
  if (dayData[0].date.getDay() >= 6) {
    weekData[weekCount].endDate = dayData[0].date;
  }

  for (let i=1; i < dayData.length; i++) {
    const currentDayData = dayData[i];
    const dayOfWeek = currentDayData.date.getDay();

    //if its the same week, day of week must be greater, and it must be within a week in milliseconds
    if (dayOfWeek > weekData[weekCount].date.getDay() &&
        Math.abs(currentDayData.date.getTime() - weekData[weekCount].date.getTime()) <= 604800000)
    {
      weekData[weekCount].workTime += currentDayData.workTime;
      weekData[weekCount].breakTime += currentDayData.breakTime;
    } else {
      weekData.push(Object.assign({}, currentDayData));
      weekCount++;
    }



    //add week end date if at end or end of week
    let nextDay
    if (dayData[i + 1]) {
      nextDay = dayData[i + 1].date;
    }

    //if at end
    //or if next day of week is smaller than curretn day of week
    //or there's more than a weeks worth of milliseconds,
    //you're at the end of the week
    if (i === dayData.length - 1 ||
        nextDay.getDay() < dayOfWeek ||
        Math.abs(nextDay.getTime() - currentDayData.date.getTime()) > 604800000
    ) {
      weekData[weekCount].endDate = currentDayData.date;
    }
    // else if (dayOfWeek >= 6) {
    //   weekData[weekCount].endDate = currentDayData.date;
    // }

  }
  //if there is only 1 week of data, it doesn't have an end date yet, add one
  if (weekData.length === 1) {
    weekData[0].endDate = dayData[dayData.length-1].date;
  }
  //add ratio property
  //if breakTime is 0, it's treated as 1 for now :/
  weekData.forEach((d)=>{
    if (d.breakTime !== 0) {
        d.ratio = d.workTime / d.breakTime;
    } else {
      d.ratio = 1;
    }
  });

  // sort descending by date
  weekData.sort((prev, next)=>{
    return  next.date - prev.date;
  });
  return weekData;
}
