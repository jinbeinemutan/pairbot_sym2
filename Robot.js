class Robot {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.lookCoord = new Array(7);
    this.lookLight = new Array(7);
    this.nextgo = [0, 0];
    this.whereIsPair = 0;
    c.setRTB(x, y, id);
  }

  lookPhase() {
    let surround = [
      c.getRTB(this.x, this.y),
      c.getRTB(this.x + 1, this.y),
      c.getRTB(this.x, this.y + 1),
      c.getRTB(this.x - 1, this.y + 1),
      c.getRTB(this.x - 1, this.y),
      c.getRTB(this.x, this.y - 1),
      c.getRTB(this.x + 1, this.y - 1),
    ];
    for (let i = 0; i < surround.length; i++) {
      if (surround[i].length > 1 && surround[i][1] == -1) {
        this.lookCoord[i] = "O";
      } else {
        this.lookCoord[i] = surround[i].length - 1;
      }
    }

    if (nowAlgo.getIsLight()) {
      //lightに関する情報を取得
      for (let i = 0; i < this.lookCoord.length; i++) {
        if (this.lookCoord[i] > 0) {
          this.lookLight[i] = surround[i].slice(1);
        }
      }
    }

    //相方の場所を探す
    this.whereIsPair = 0;
    for (let i = 1; i < surround.length; i++) {
      for (let j = 0; j < surround[i].length; j++) {
        if (surround[i][j] == this.id) {
          this.whereIsPair = i;
          break;
        }
      }
    }
  }

  computePhase() {
    this.nextgo = [0, 0];
    let tmp = [];
    tmp.push(this.whereIsPair);
    tmp = tmp.concat(this.lookCoord);

    let foo = nowAlgo.getRule();

    for (let i = 0; i < foo.length; i++) {
      if (compare(tmp, foo[i])) {
        this.nextgo = dct2xy(foo[i][8]);
        break;
      }
    }
  }

  movePhase() {
    if (this.nextgo[0] == 0 && this.nextgo[1] == 0) return false;
    c.RTB_RM(this.x, this.y, this.id);
    c.setRTB(this.x + this.nextgo[0], this.y + this.nextgo[1], this.id);
    this.x += this.nextgo[0];
    this.y += this.nextgo[1];
    return true;
  }

  compareLight(lightRule) {
    for (let i = 0; i < this.lookLight.length; i++) {
      if (this.lookCoord[i] > 0 && this.lookCoord[i] === "") {
        if (!(this.lookLight[i].toString() === lightRule[i].toString())) {
          return false;
        }
      }
    }
    return true;
  }
}
function compare(tmp, rule) {
  for (let i = 0; i < tmp.length; i++) {
    if (
      tmp[i] != Math.ceil(rule[i]) &&
      tmp[i] != Math.floor(rule[i]) &&
      tmp[i] != rule[i] &&
      rule[i] != "A"
    ) {
      return false;
    }
  }
  return true;
}

function dct2xy(i) {
  switch (i) {
    case 1:
      return [1, 0];
    case 2:
      return [0, 1];
    case 3:
      return [-1, 1];
    case 4:
      return [-1, 0];
    case 5:
      return [0, -1];
    case 6:
      return [1, -1];
  }
}
function xy2dct(a, b) {
  if (a == 1 && b == 0) return 1;
  if (a == 0 && b == 1) return 2;
  if (a == -1 && b == 1) return 3;
  if (a == -1 && b == 0) return 4;
  if (a == 0 && b == -1) return 5;
  if (a == 1 && b == -1) return 6;
}
