import React from 'react';
import './Nav.css';

class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      clickShow: false
    }
  }
  toggleShow () {
    this.setState({ clickShow: !this.state.clickShow });
  }
  handleTimerClick(){
    if (this.props.viewTimer()){
      this.setState({ clickShow: false });
    };
  }
  handleHistoryClick(){
    if(this.props.viewHistory()){
      this.setState({ clickShow: false });
    }
  }
  render() {
    let classes = 'nav', historyClass, timerClass;
    if (this.props.view !=='TIMER') {
        classes += ' showButton';
    }
    //if nav was clicked on, and then timer started while it was open, close it
    if (this.state.clickShow && this.props.view === 'TIMER') {
      this.setState({clickShow: false});
    }
    if (this.state.clickShow ) {
      classes += ' showAll';
    }

    if (this.props.view === 'START' || this.props.view === 'FINISH') {
      timerClass = 'on';
    } else if (this.props.view === 'HISTORY') {
      historyClass = 'on';
    }

    return (
      <div className={classes}>
        <span className="navButton" onClick={this.toggleShow.bind(this)} />
        <ul>
          <li className={timerClass} onClick={this.handleTimerClick.bind(this)}><span>Timer</span></li>
          <li className={historyClass} onClick={this.handleHistoryClick.bind(this)} style={{transitionDelay: '.035s'}}><span>History</span></li>
        </ul>
      </div>
    );
  }
}

export default Nav;
