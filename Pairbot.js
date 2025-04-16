class Pairbot {
  constructor(x, y, id, color, longdirct) {
    this.robA = new Robot(x, y, id);
    this.robB = new Robot(x + longdirct[0], y + longdirct[1], id);
    this.isLong = false;
    this.setIsLong();
    this.isActivate = false;
    this.AsyncPhase = 0;
    this.color = color;
    this.id = id;
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
