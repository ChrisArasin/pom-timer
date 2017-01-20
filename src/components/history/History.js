import React from 'react';
import VerticalCenter from '../VerticalCenter';
import Bar from './Bar';
import Toggle from './Toggle';
import RatioComparison from './RatioComparison';
import {getWeekData} from '../utils/dataManagement';
import './History.css'

class History extends React.Component {
  constructor() {
    super();
    this.state = {
      breakFirst: false,
      normalize: false
    };
  }
  displayTime(){
    this.setState({normalize: false});
  }
  displayRatio(){
    this.setState({normalize: true});
  }
  displayBreakFirst(){
    this.setState({breakFirst: true});
  }
  displayWorkFirst(){
    this.setState({breakFirst: false});
  }


  render() {

    const delays=[];
    for (let i=1; i <= 3; i++) {
      delays.push({transitionDelay: 40 * i + 'ms'});
    }
    if (this.props.data.length === 0) {
      //return empty state
      return (
        <VerticalCenter front={true}>
          <div className="history">
            <div className="historyChild">
              <p >No data saved. Go do some work.</p>
            </div>
          </div>
        </VerticalCenter>
      );
    }

    const weekData = getWeekData(this.props.data);

    //find max bar quantity. Used for sizing relative to eachother.
    const max = weekData.reduce( (prev, curr) => (
      prev.workTime + prev.breakTime > curr.workTime + curr.breakTime ? prev : curr
    ));
    const bars = weekData.map((d, i) => (
      <Bar key={"historyBar" + i}
          data={d}
          maxTime={max.workTime + max.breakTime}
          breakFirst={this.state.breakFirst}
          normalize={this.state.normalize}
          index={i + 2}
          totalRows={weekData.length + 2}  />
    ));

    const textDelay = delays[0];

    let thisWeek, lastWeek, avgWeek, textContent;

    if (weekData.length > 1) {
      thisWeek = weekData[0].ratio;
      lastWeek = weekData[1].ratio;
      avgWeek = weekData.reduce((prev,curr)=>({ratio: prev.ratio + curr.ratio})).ratio / weekData.length;
      textContent = (
        <div style={textDelay} className="historyChild">
          <h3>This Week's Work-to-Break Ratio</h3>
          <RatioComparison thisWeek={thisWeek} compWeek={lastWeek} label="Compared to last week:" />
          <RatioComparison thisWeek={thisWeek} compWeek={avgWeek} label="Compared to avg:" />
        </div>);
    }

    return (
      <VerticalCenter front={true}>
        <div className="history">
          <h2 className="historyChild history-header">How am I Doing?</h2>
          {textContent}
          <div className="history-controls historyChild" style={ delays[1]} >
            <Toggle label="Graph" b1Text="Total Time" b2Text="Work-to-Break Ratio" b1Click={this.displayTime.bind(this)} b2Click={this.displayRatio.bind(this)} buttonOn={this.state.normalize ? 2 : 1} />
            <Toggle label="Display" b1Text="Work First" b2Text="Break First" b1Click={this.displayWorkFirst.bind(this)} b2Click={this.displayBreakFirst.bind(this)} buttonOn={this.state.breakFirst ? 2 : 1} />
          </div>
          <div className="history-data-wrap historyChild"  style={ delays[2]} >
            <div className="bar-wrap bar-header">
              <div className="bar-data">
                <div className="bar-date date-range  bar-text">Dates</div>
                <span className="bar-work-time bar-text">Work</span>
                <span className="bar-break-time bar-text">Break</span>
                <span className="bar-ratio bar-text">Ratio</span>
              </div>
            </div>
            {bars}
          </div>
        </div>
      </VerticalCenter>
    )
  }
}

export default History;
