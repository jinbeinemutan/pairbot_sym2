class Pairbot {
  constructor(id, x, y, color, longdirct,light) {
    this.robA = new Robot(id, x, y);
    this.robB = new Robot(id, x + longdirct[0], y + longdirct[1]);
    this.isLong;
    this.setIsLong();
    this.isActivate = false;
    this.AsyncPhase = 0;
    this.color = color;
    this.id = id;//warning!: IDは1から始まります
    this.light = light;
    this.serected = false;
  }

  setIsLong() {
    this.isLong = this.robA.x != this.robB.x || this.robA.y != this.robB.y;
  }

  getColor() {
    return this.color;
  }

  pairLookPhase() {
    this.robA.lookPhase();
    this.robB.lookPhase();
  }

  pairComputePhase() {
    this.robA.computePhase();
    this.robB.computePhase();
  }
  pairMovePhase() {
    if (this.isLong) {
      this.robA.movePhase();
    }
    this.robB.movePhase();
    this.setIsLong();
  }

  getIsLong() {
    return this.isLong;
  }
  setIsLong() {
    this.isLong = this.robA.x != this.robB.x || this.robA.y != this.robB.y;
  }

  ActAsyncPhase() {
    switch (this.AsyncPhase) {
      case 0:
        this.pairLookPhase();
        break;
      case 1:
        this.pairComputePhase();
        break;
      case 2:
        this.pairMovePhase();
        break;
    }
    this.AsyncPhase = (this.AsyncPhase + 1) % 3;
  }
}
