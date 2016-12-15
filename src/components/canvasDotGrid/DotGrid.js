import * as PIXI from 'pixi.js';
import TWEEN from 'tween.js';
import Dot from './Dot';

class DotGrid {
  constructor(numMinutes, gap, margin, isBreak, stage, delay){
    this.dotTween = 400;
    this.delay = delay = this.dotTween;
    this.gap = gap;
    this.margin = margin;
    this.pContainer = new PIXI.Container();
    stage.addChild(this.pContainer);
    this.dots = [];
    for (let i = 0; i < numMinutes * 60; i++) {
      this.addDot(1, isBreak);
    }
    this.dots.forEach((p)=>{
      p.setBottomDistance(this.dots.length, gap);
    });
    this.maxDistance = Math.max.apply(Math, this.dots.map(function(o){return o.distanceBottomLeft;}));
  }
  getMaxTopLeftDistance() {
    return Math.max.apply(Math, this.dots.map(function(o){return o.distanceTopLeft;}));
  }
  getMaxBottomLeftDistance() {
    return Math.max.apply(Math, this.dots.map(function(o){return o.distanceBottomLeft;}));
  }
  getMaxExitDistance() {
    return Math.max.apply(Math, this.dots.map(function(o){return o.distanceExit;}));
  }
  addDot(numToAdd = 1, isBreak, afterTime = false) {
    for (let i = 0; i < numToAdd; i++) {
      const newDot = new Dot(this.dots.length, this.gap, this.margin, isBreak, afterTime);
      this.dots.push(newDot);
      this.pContainer.addChild(newDot );
    }
  }
  exitDots(clockHeight) {
    var outTweens = [];
    //update exit distances
    //current timer location and any extra dots effects this
    this.dots.forEach( (d) => {
      d.setExitDistance(clockHeight + 30, this.gap);
    });

    const maxExitDistance = this.getMaxExitDistance();

    //set delays based on this distance
    this.dots.forEach((d)=> {
      const delay = (d.distanceExit/maxExitDistance) * this.delay;
      d.delayHide(delay, this.dotTween);
    });
    // there's delay in the tweens if you start them in the above loop when calculating delays
    //using second loop to start all at once
    this.dots.forEach((d)=> {
      //if dot is tweening on, stop it
      if (d.onTween) {
        d.onTween.stop()
      }
      d.hideTween.start();
    });
    outTweens.forEach((t)=>t.start());
  }
  enterDots() {
    var inTweens = [];
    this.dots.forEach((d)=> {
      const delay = (d.distanceTopLeft/this.maxDistance) * this.delay;
      var alphaTween = d.delayShow(delay, this.dotTween);
      inTweens.push(alphaTween);
    });
    inTweens.forEach((t)=>t.start());
  }
  turnOn(dotIndices) {
    dotIndices.forEach( (d)=>{this.dots[d].turnOn()});
  }
  turnOff(dotIndices) {
    dotIndices.forEach( (d)=>{
      if (d < this.dots.length) {
        this.dots[d].turnOff();
      }
    });
  }
  removeFromEnd(numToRemove) {
    const numDots = this.dots.length;
    this.pContainer.removeChildren(numDots - numToRemove, numDots);
    this.dots.splice(numDots - numToRemove, numToRemove);
  }
  reset(numDots, isBreak) {
    //could rewrite this to repurpose existing dots, but runs fast enough now...
    //remove dots
    this.pContainer.removeChildren(0, this.dots.length);
    this.dots = [];
    //create new ones
    this.addDot(numDots, isBreak);
    this.enterDots();
  }

  animate() {
    TWEEN.update();
  }
}

export default DotGrid;
