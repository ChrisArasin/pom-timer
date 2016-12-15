import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Timer from './components/Timer';
import StartForm from './components/StartForm';
import SessionFinish from './components/SessionFinish';
import History from './components/history/History';
import Nav from './components/Nav';
import * as dataManagement from './components/utils/dataManagement'

import './App.css';
class App extends Component {
  constructor() {
    super();
    this.state = {
      view: 'START', //START, TIMER, HISTORY, FINISH, HISTORY, -- CLEAR
      setWorkMinutes: 25, //default
      setBreakMinutes: 5,
      setNumTimes: 8,
      sessionWork: 0,
      sessionBreak: 0,
      todayWork: 0,
      todayBreak:0,
      data: []
    };
  }
  componentWillMount() {
    const newData = dataManagement.getDataFromStorage();
    const workSetting = dataManagement.getWorkSettingFromStorage();
    const breakSetting = dataManagement.getBreakSettingFromStorage();
    const numTimesSetting = dataManagement.getTimesSettingFromStorage();

    this.setState({
      data: newData ? newData : this.state.data,
      setWorkMinutes: workSetting ? workSetting : this.state.setWorkMinutes,
      setBreakMinutes: breakSetting ? breakSetting : this.state.setBreakMinutes,
      setNumTimes: numTimesSetting ? numTimesSetting : this.state.setNumTimes
    });

  }

  saveTodayData() {
    const currentData = this.state.data.map((d)=>(Object.assign({}, d)));
    const todayString = new Date(Date.now()).toDateString();
    const todayData = currentData.filter((d)=>{
      return d.date.toDateString() === todayString;
    });
    if (todayData.length > 0) {
      todayData[0].workTime = this.state.todayWork;
      todayData[0].breakTime = this.state.todayBreak;
    } else {
      currentData.push({
        date: new Date(Date.now()),
        workTime: this.state.todayWork,
        breakTime: this.state.todayBreak
      });
    }
    this.setState({data: currentData});
    dataManagement.saveDataToStorage(currentData);
  }

  clearToView(view, delay=500) {
    if (this.state.view !== view) {
      this.setState({view: 'CLEAR'});
      setTimeout(()=>{
        this.setState({view: view});
      }, delay);
      return true;
    } else {
      return false;
    }
  }
  clearToHistory(){
    return this.clearToView('HISTORY');
  }
  clearToStart(){
    return this.clearToView('START');
  }
  handleStartAnother(e){
    e.preventDefault();
    this.clearToStart();
  }

  handleStartInputChange(setting, e) {
    let value = parseInt(e.target.value, 10);
    if (! value) {
      value = 0;
    }
    this.setState({[setting]: value});
    //save prefs to storage
    switch (setting) {
      case 'setWorkMinutes':
        dataManagement.saveWorkSettingToStorage(value);
        break;
      case 'setBreakMinutes':
        dataManagement.saveBreakSettingToStorage(value);
        break;
      case 'setNumTimes':
        dataManagement.saveTimesSettingToStorage(value);
        break;
      default:
        break;
    }
  }

  handleStartSubmit(e) {
    e.preventDefault();
    this.clearToView('TIMER');
  };

  handleSessionFinish(timeWork, timeBreak){
    this.setState({
      sessionWork: timeWork,
      sessionBreak: timeBreak,
      todayWork: this.state.todayWork + timeWork,
      todayBreak: this.state.todayBreak + timeBreak
    });
    this.saveTodayData();
    setTimeout(()=>{
      this.clearToView('FINISH', 10);
    }, 900)

  }

  render() {
    let component;
    switch(this.state.view) {
      case 'START':
        component = <StartForm key="startView" setWorkMinutes={this.state.setWorkMinutes} setBreakMinutes={this.state.setBreakMinutes} setNumTimes={this.state.setNumTimes} handleChange={this.handleStartInputChange.bind(this)} handleSubmit={this.handleStartSubmit.bind(this)} />;
        break;
      case 'TIMER':
        component = <Timer key="timerView" handleSessionFinish={this.handleSessionFinish.bind(this)} setWorkMinutes={this.state.setWorkMinutes} setBreakMinutes={this.state.setBreakMinutes} setNumTimes={this.state.setNumTimes} />;
        break;
      case 'FINISH':
        component = <SessionFinish
          key="finishView"
          showText={this.state.showText}
          sessionWork={this.state.sessionWork}
          sessionBreak={this.state.sessionBreak}
          todayWork={this.state.todayWork}
          todayBreak={this.state.todayBreak}
          handleStartAnother={this.handleStartAnother.bind(this)}
          />
        break;
      case 'HISTORY':
        component = <History key="historyView" data={this.state.data} />;
        break;
      default:
       component = <div />;
    }

    return (
      <div className="app">
        <ReactCSSTransitionGroup
          component="div" transitionName="appTransition"
          transitionEnterTimeout={600 + 150}
          transitionAppearTimeout={600 + 150} transitionAppear={true}
          transitionLeaveTimeout={600 + 150}
          >
            {component}
        </ReactCSSTransitionGroup>

        {/* <div style={{zIndex: 4000, position:'absolute', top: '20px'}}>
          <a style={{color: '#fff', padding: '20px 10px'}} onClick={dataManagement.saveSampleData} >Sample Data</a>
        </div> */}

        <Nav view={this.state.view} viewHistory={this.clearToHistory.bind(this)} viewTimer={this.clearToStart.bind(this)} />
      </div>
    );
  }
}

export default App;
