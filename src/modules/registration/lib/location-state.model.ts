export class LocationState {
  constructor(step: State) {
    this.state = step;
    this.keys = Object.keys(State).filter(k => typeof State[k as any] === 'number');
    this.values = this.keys.map(k => State[k as any]);
  }

  state: State;
  private keys;
  private values;

  switchState(dir) {
    const target = this.state + dir;
    if (target >= this.min && target <= this.max) {
      this.state += dir;
    }
  }

  checkState(step) {
    return this.state === step;
  }

  get step1() {
    return this.checkState(State.step1);
  }
  get step2() {
    return this.checkState(State.step2);
  }
  get step3() {
    return this.checkState(State.step3);
  }
  get confirm() {
    return this.checkState(State.confirm);
  }
  get pay() {
    return this.checkState(State.pay);
  }
  get finish() {
    return this.checkState(State.finish);
  }
  get step4() {
    return this.checkState(State.step4);
  }
  get max() {
    return this.values[this.values.length - 1];
  }
  get min() {
    return this.values[0];
  }
}

export enum State {
  step1 = 1,
  step2 = 2,
  step3 = 3,
  confirm = 4,
  pay = 5,
  finish = 6,
  step4 = 7
}
