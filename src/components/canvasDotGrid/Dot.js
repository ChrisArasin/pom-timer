import * as PIXI from 'pixi.js';
import TWEEN from 'tween.js';
import particleImg from '../../img/particle.png';

class Dot extends PIXI.Sprite {
  constructor(i, gap, margin, isBreak, afterTime = false){
    super(PIXI.loader.resources[particleImg].texture);
    this.anchor.set(0.5);
    this.scaleFactor = 0.09375;
    this.offScaleFactor = 0.09375;
    this.onScaleFactor = 0.125;
    this.scale.x = .09375;
    this.scale.y = .09375;
    this.offAlpha = 0.35;
    this.onAlpha = 0.9;
    this.hiddenAlpha = 0;
    this.alpha = 0;
    if (isBreak) {
      this.onColor =  {r: .431, g: .341, b: .643};
    } else {
      this.onColor =  {r: .933, g: .184, b: .329}
    }

    this.row =  Math.floor(i / 60);
    this.col =   i - (this.row * 60);
    this.gap = gap;
    this.on = false;
    this.position.x = this.col * gap + margin/2;
    this.position.y = (this.row + 1) * gap + margin/2;
    this.offY = (this.row + 1) * gap + margin/2;
    this.onY = (this.row) * gap + margin/2;
    if (afterTime) {
      this.position.y += gap;
      this.offY += gap;
      this.onY += gap;
    }

    this.distanceTopLeft = Math.sqrt(this.position.x  * this.position.x  + this.position.y * this.position.y);
  }
  setBottomDistance (totalDots, gap) {
    var totalRows = Math.ceil(totalDots / 60);
    var totalHeight = totalRows * gap;
    this.distanceBottomLeft = Math.sqrt( this.position.x * this.position.x  + (totalHeight - this.position.y) * (totalHeight - this.position.y) );
  }
  setExitDistance (timerHeight, gap) {
    this.distanceExit = Math.sqrt( this.position.x * this.position.x  + (timerHeight - this.position.y) * (timerHeight - this.position.y) );
  }
  delayShow (delayTime, tweenTime) {
    var that = this;
    var tween = new TWEEN.Tween({alpha: this.alpha})
      .delay(delayTime)
      .easing(TWEEN.Easing.Quadratic.Out)
      .to({ alpha: this.offAlpha}, tweenTime)
      .onUpdate(function(){
        that.alpha = this.alpha;
      });
    return tween;
  }
  delayHide (delayTime, tweenTime) {
    var that = this;
    this.hideTween = new TWEEN.Tween({alpha: this.alpha})
      .delay(delayTime)
      .easing(TWEEN.Easing.Quadratic.Out)
      .to({ alpha: this.hiddenAlpha}, tweenTime)
      .onUpdate(function(){
        that.alpha = this.alpha;
      });
  }
  turnOn() {
    if (! this.on) {
      this.on = true;
      var that = this;
      var toY = this.onY;
      this.onTween = new TWEEN.Tween({
        y: this.position.y,
        scaleFactor: this.scaleFactor,
        alpha: this.alpha,
        r: 1,
        g: 1,
        b: 1
      })
      .to({
        y: toY,
        scaleFactor: this.onScaleFactor ,
        alpha: this.onAlpha,
        r: this.onColor.r,
        g: this.onColor.g,
        b: this.onColor.b
      }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        that.position.y = this.y;
        that.alpha = this.alpha;
        that.scale.x = this.scaleFactor;
        that.scale.y = this.scaleFactor;
        that.tint = PIXI.utils.rgb2hex([this.r, this.g, this.b]);
      })
      .start();
    }
  }
  turnOff() {
    if (this.on) {
      this.on = false;
      var that = this;
      var toY = this.offY;
      new TWEEN.Tween({
        y: this.position.y,
        scaleFactor: this.scaleFactor,
        alpha: this.alpha,
        r: this.onColor.r,
        g: this.onColor.g,
        b: this.onColor.b
      })
      .to({
        y: toY,
        scaleFactor: this.offScaleFactor ,
        alpha: this.offAlpha,
        r: 1,
        g: 1,
        b: 1
      }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        that.position.y = this.y;
        that.alpha = this.alpha;
        that.scale.x = this.scaleFactor;
        that.scale.y = this.scaleFactor;
        that.tint = PIXI.utils.rgb2hex([this.r, this.g, this.b]);
      })
      .start();
    }
  }
  hide () {
    new TWEEN.Tween(this)
      .to({alpha: 0}, 200)
      .start();
  }
}

export default Dot;
