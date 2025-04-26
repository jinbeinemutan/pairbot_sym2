class Pairbot {
  constructor(id, x, y, color, longdirct, light) {
    this.robA = new Robot(id, x, y, light);
    this.robB = new Robot(id, x + longdirct[0], y + longdirct[1], light);
    this.isLong;
    this.setIsLong();
    this.isActivate = false;
    this.AsyncPhase = 0;
    this.color = color;
    this.id = id; //warning!: IDは1から始まります
    this.light = light;
    this.serected = false;
  }
  getRobA() {
    return this.robA;
  }
  setRobA(rob) {
    this.robA.setcp(rob);
  }

  getRobB() {
    return this.robB;
  }
  setRobB(rob) {
    this.robB.setcp(rob);
  }
  getIsLong() {
    return this.isLong;
  }
  setIsLong() {
    this.isLong = this.robA.x != this.robB.x || this.robA.y != this.robB.y;
  }
  getIsActivate() {
    return this.isActivate;
  }
  setIsActivate(bool) {
    this.isActivate = bool;
  }
  getAsyncPhase() {
    return this.AsyncPhase;
  }
  setAsyncPhase(s) {
    this.AsyncPhase = s;
  }
  getColor() {
    return this.color;
  }
  setColor(c) {
    this.color = c;
  }

  getID() {
    return this.id;
  }
  setID(id) {
    this.id = id;
  }

  getLight() {
    return this.light;
  }

  setLight(light) {
    this.robA.setLight(light);
    this.robB.setLight(light);
    this.light = light;
  }

  setAll(pb) {
    this.setID(pb.getID());
    this.setIsActivate(pb.getIsActivate());
    this.setAsyncPhase(pb.getAsyncPhase());
    this.setColor(pb.getColor());
    this.setLight(pb.getLight());
    this.setRobA(pb.getRobA());
    this.setRobB(pb.getRobB());
  }

  pairSetRTB() {
    c.setRTB(this.robA.getX(), this.robA.getY(), this.id);
    c.setRTB(this.robB.getX(), this.robB.getY(), this.id);
  }

  pairLookPhase() {
    this.robA.lookPhase();
    this.robB.lookPhase();
  }

  pairComputePhase() {
    this.robA.computePhase();
    this.robB.computePhase();
  }

  makeRule(move, light) {
    this.pairLookPhase();
    this.robA.ruleMaker(move, light);
  }

  pairMovePhase() {
    if (this.isLong) {
      this.robA.movePhase();
    }
    this.robB.movePhase();
    this.setIsLong();
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
