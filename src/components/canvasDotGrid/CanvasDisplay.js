import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import DotGrid from './DotGrid';
import particleImg from '../../img/particle.png';
import './CanvasDisplay.css';

class CanvasDisplay extends Component {
  componentDidMount() {
    const displayResolution = window.devicePixelRatio;
    const renderOptions = {
      view: this.canvas,
      antialias: true,
      transparent: false,
      resolution: displayResolution,
      backgroundColor : 0x242424
    };
    this.renderer = PIXI.autoDetectRenderer( this.props.width , this.props.height, renderOptions);
    this.stage = new PIXI.Container();
    this.renderer.render(this.stage);

    //only load image once
    if (PIXI.loader.resources[particleImg]) {
      this.setup();
    } else {
      PIXI.loader.add(particleImg).load(this.setup.bind(this));
    }
  }
  checkResize(nextProps) {
    if (this.props.height !== nextProps.height) {
      this.renderer.resize(nextProps.width, nextProps.height);
    }
  }
  checkAddExtraDots(nextSeconds) {
    if (nextSeconds > this.dotGrid.dots.length) {
      const numToAdd = nextSeconds - this.dotGrid.dots.length;
      this.dotGrid.addDot(numToAdd, this.props.breaking, true);
    }
  }
  checkTurnDotsOn(nextSeconds, currentSeconds) {
    if (nextSeconds > currentSeconds) {
      let indicesToTurn = [];
      for (let i=currentSeconds; i < nextSeconds; i++) {
        indicesToTurn.push(i);
      }
      this.dotGrid.turnOn(indicesToTurn);
    }
  }
  checkRemoveAndTurnDotsOff(nextSeconds, currentSeconds) {
    if (nextSeconds < currentSeconds) {
      const sessionSeconds = this.props.sessionMinutes * 60;
      if (currentSeconds > sessionSeconds) {
        let numToRemove;
        if (nextSeconds < sessionSeconds) {
          numToRemove = currentSeconds - sessionSeconds;
        } else {
          numToRemove = currentSeconds - nextSeconds;
        }
        this.dotGrid.removeFromEnd(numToRemove);
      }
      let indicesToTurn = [];
      for (let i=currentSeconds; i >= nextSeconds; i--) {
        indicesToTurn.push(i);
      }
      this.dotGrid.turnOff(indicesToTurn);
    }
  }
  componentWillReceiveProps(nextProps) {
    //check resize canvas needs to rezie
    this.checkResize(nextProps);

    //check for switch between sessions
    if (nextProps.status === "switching") {
      this.dotGrid.exitDots(Math.ceil(this.props.elapsedSeconds / 60) * this.props.gap);
    }
    else if(nextProps.status === "reset") {
      this.dotGrid.reset(nextProps.sessionMinutes * 60, nextProps.breaking);
    }
    else if (nextProps.status === 'active' && this.dotGrid) {
      const currentSeconds = this.props.elapsedSeconds;
      const nextSeconds = nextProps.elapsedSeconds;
      this.checkAddExtraDots(nextSeconds);
      this.checkTurnDotsOn(nextSeconds, currentSeconds);
      this.checkRemoveAndTurnDotsOff(nextSeconds, currentSeconds);
    }
  }

  setup() {
    this.dotGrid = new DotGrid(this.props.sessionMinutes, this.props.gap, this.props.margin, this.props.breaking, this.stage, this.props.delay);
    this.animate();
    this.dotGrid.enterDots();
  }
  animate() {
    this.animationFrame = requestAnimationFrame (this.animate.bind(this));
    this.dotGrid.animate();
    this.renderer.render(this.stage);
  }
  render() {
    const styles = {
      width: this.props.width + 'px', height: this.props.height + 'px'
    }
    return (
      <div className="canvasWrap" style={styles}>
        <canvas ref={(c)=> this.canvas = c} style={styles} />
      </div>
  );
  }
}


export default CanvasDisplay;
