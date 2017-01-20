import React, { Component } from 'react';
import CanvasDisplay from './canvasDotGrid/CanvasDisplay';
import ProgressBar from './ProgressBar';
import TimeText from './TimeText';
import VerticalCenter from './VerticalCenter';
import beep from '../sound/beep.wav';
import './Timer.css';

//setWorkMinutes, setBreakMinutes, setNumTimes
class Timer extends Component {
  constructor(props) {
    super(props);
    this.beep = new Audio(beep);
    this.state = {
      elapsedSeconds: 0,
      paused: false,
      breaking: false,
      totalTime: (this.props.setWorkMinutes * this.props.setNumTimes + this.props.setBreakMinutes * (this.props.setNumTimes - 1)) * 60,
      sessionMinutes: this.props.setWorkMinutes,
      status: 'mount',
      totalWork: 0,
      totalBreak: 0
    };
    this.handleKeypress = this.handleKeypress.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keyup', this.handleKeypress);
    requestAnimationFrame(()=>{
      this.setState({
        status: 'active',
      });
      this.newTimer();
    });
  }
  newTimer() {
    this.start = new Date().getTime();
    this.elapsed = 0;
    this.prevSecond = 0;
    this.timer = requestAnimationFrame(this.timerInterval.bind(this));
  }
  timerInterval() {
    if (! this.state.paused) {
      var time = new Date().getTime() - this.start;
      this.elapsed = Math.floor(time / 1000);
      if (this.elapsed > this.prevSecond) {
        this.tick(this.elapsed - this.prevSecond);
        this.prevSecond = this.elapsed;
      }
    }
    this.timer = requestAnimationFrame(this.timerInterval.bind(this));
  }
  pause() {
    if (!this.state.paused) {
      this.pauseStart = new Date().getTime();
      this.setState({paused: true});
    }
  }
  handleKeypress(e) {
    //spaceBar
    if (e.keyCode === 32) {
      if (this.state.paused) {
        this.unPause();
      } else {
        this.pause();
      }
    }
    //return key
    if (e.keyCode === 13) {
      //update time values
      const addToWork = this.state.breaking ? 0 : this.state.elapsedSeconds;
      const addToBreak = this.state.breaking ? this.state.elapsedSeconds : 0;
      this.setState({
        totalWork: this.state.totalWork + addToWork,
        totalBreak: this.state.totalBreak + addToBreak,
        barUpdate: true
      });

      //if session complete
      if (this.state.totalWork + this.state.totalBreak >= this.state.totalTime) {
        this.setState({
          paused: true,
          status: 'switching'
        });
        this.props.handleSessionFinish(this.state.totalWork, this.state.totalBreak);
      } else {
        //otherwise swtich to break/active
        this.switch();
      }
    }
  }
  unPause() {
    if (this.state.paused) {
      const pauseEnd = new Date().getTime();
      const totalPause = pauseEnd - this.pauseStart;
      this.start += (totalPause);
      this.setState({paused: false});
    }
  }
  tick(elapsed) {
    this.setState({elapsedSeconds: this.state.elapsedSeconds + elapsed});
    //play alert sound at end of set time
    if (this.state.elapsedSeconds === this.state.sessionMinutes * 60) {
      this.beep.play();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeypress);
    cancelAnimationFrame(this.timer);
  }
  switch() {
    if (this.state.status === 'active') {

      //pause, exit dots, update bar
      this.setState({
        paused: true,
        status: 'switching'
      });

      setTimeout(()=>{
        this.setState({
          elapsedSeconds: 0,
          status: 'reset',
          sessionMinutes:  this.state.breaking ? this.props.setWorkMinutes : this.props.setBreakMinutes,
          breaking: !this.state.breaking,
        });
        setTimeout(()=>{
          this.newTimer();
          this.setState({
            status: 'enter',
            paused: true
          });
        }, 10);
        setTimeout(()=>{
          this.newTimer();
          this.setState({
            status: 'active',
            paused: false,
            barUpdate: false
          });
        },  this.props.delay );
      }, this.props.delay );
    }
  }
  render() {
    let gHeight = this.props.setWorkMinutes > Math.ceil(this.state.elapsedSeconds / 60) ? this.props.setWorkMinutes * this.props.gap : Math.ceil(this.state.elapsedSeconds / 60) * this.props.gap; //one row per minute

    const height = Math.round(gHeight + (this.props.margin * 2)) + 10;
    const widthStyle = {width: this.props.width + 'px'};
    return (
      <VerticalCenter front={false}>
        <div className="timer" style={widthStyle}>
          <div className="timer-inner" style={{transform: this.props.innerPush}}>
            <TimeText elapsedSeconds={this.state.elapsedSeconds}
                      gap={this.props.gap}
                      sessionMinutes={this.state.sessionMinutes}
                      status={this.state.status}
                      breaking={this.state.breaking} />
            <CanvasDisplay {...this.props}
              elapsedSeconds={this.state.elapsedSeconds}
              breaking={this.state.breaking}
              sessionMinutes={this.state.sessionMinutes}
              status={this.state.status}
              gap={this.props.gap}
              height={height} />
            <ProgressBar
              totalWork={this.state.totalWork}
              totalBreak={this.state.totalBreak}
              width={this.props.gWidth - this.props.gap }
              margin={this.props.margin}
              totalTime={this.state.totalTime}
              status={this.state.status}
              barUpdate={this.state.barUpdate}
               />
          </div>
      </div>
      </VerticalCenter>
    );
  }
}

const width = 600,
      margin = 10,
      gWidth = width - (margin * 2),
      gap = gWidth / 60;

Timer.defaultProps = {
  delay: 900, //ms
  width: width,
  margin: margin,
  gWidth: width - (margin * 2),
  gap: gap,
  innerPush: "translateX(" + margin + "px)"
}

export default Timer;
