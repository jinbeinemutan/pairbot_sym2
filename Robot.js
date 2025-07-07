class Robot {
  constructor(id, x, y, light) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.lookCoord;

    //[ロボの数(+Obj)，lightの色…]
    this.nextgo = [0, 0];
    this.light = light;
    this.nextLight;
    this.whereIsPair = 0;
  }

  lookPhase() {
    this.lookCoord = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.lookCoord[i] = [];
    }
    let surround = [
      c.getRTB(this.x, this.y),
      c.getRTB(this.x + 1, this.y),
      c.getRTB(this.x, this.y + 1),
      c.getRTB(this.x - 1, this.y + 1),
      c.getRTB(this.x - 1, this.y),
      c.getRTB(this.x, this.y - 1),
      c.getRTB(this.x + 1, this.y - 1),
    ];

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

    for (let i = 0; i < surround.length; i++) {
      if (surround[i].length > 1 && surround[i][1] == -1) {
        this.lookCoord[i].push(-1);
      } else {
        this.lookCoord[i].push(surround[i].length - 1);
      }
    }
    // light
    for (let i = 0; i < surround.length; i++) {
      if (this.lookCoord[i][0] > 0) {
        for (let j = 0; j < surround[i].length - 1; j++) {
          this.lookCoord[i].push(id2light(surround[i][j + 1]));
        }
      }
    }
    this.light = id2light(this.id);
  }

  computePhase() {
    this.nextgo = [0, 0];
    this.nextLight = this.light;
    let tmp = new Array(8);
    tmp[0] = [this.whereIsPair, this.light];
    for (let i = 0; i < tmp.length - 1; i++) {
      if (this.lookCoord[i][0] > 2) {
        //重複検知なし
        tmp[i + 1] = this.lookCoord[i].slice(0, 3);
        tmp[i + 1][0] = 2;
      } else {
        tmp[i + 1] = this.lookCoord[i];
      }
    }

    let rule = nowAlgo.getRule();
    let div = 1;
    let ruleCollisionditect = [];

    if (!nowAlgo.getIsChirality() && nowAlgo.getAxiAgreement() == 0) {
      let rulecp = [];
      div = div * 12;
      for (let i = 0; i < rule.length; i++) {
        let aaa = makeRuleChirality(rule[i]);
        for (let j = 0; j < aaa.length; j++) {
          let bbb = makeRuleSymmetry(aaa[j]);
          for (let k = 0; k < bbb.length; k++) {
            rulecp.push(bbb[k]);
          }
        }
      }
      rule = JSON.parse(JSON.stringify(rulecp));
    }
    if (nowAlgo.getIsChirality()) {
      let rulecp = [];
      div = div * 6;
      for (let i = 0; i < rule.length; i++) {
        let aaa = makeRuleChirality(rule[i]);
        for (let j = 0; j < aaa.length; j++) {
          rulecp.push(aaa[j]);
        }
      }
      rule = JSON.parse(JSON.stringify(rulecp));
    }
    if (nowAlgo.getAxiAgreement() == 1) {
      let rulecp = [];
      div = div * 2;
      for (let i = 0; i < rule.length; i++) {
        let aaa = makeRuleSymmetry(rule[i]);
        for (let j = 0; j < aaa.length; j++) {
          rule.push(aaa[j]);
        }
      }
      rule = JSON.parse(JSON.stringify(rulecp));
    }
    if (nowAlgo.getLightType() == 2) {
      //External
      let rulecp = [];
      div = div * nowAlgo.getNLight();
      for (let i = 0; i < rule.length; i++) {
        let aaa = makeRuleExLight(rule[i]);
        for (let j = 0; j < aaa.length; j++) {
          rulecp.push(aaa[j]);
        }
      }
      rule = JSON.parse(JSON.stringify(rulecp));
    }
    for (let i = 0; i < rule.length; i++) {
      if (compare(tmp, rule[i])) {
        if (nowAlgo.getIsLight()) {
          this.nextgo = dct2xy(rule[i][8][0]);
          this.nextLight = rule[i][8][1];
        } else {
          this.nextgo = dct2xy(rule[i][8]);
        }

        ruleCollisionditect.push(parseInt(i / div));
      }
    }

    for (let i = 0; i < ruleCollisionditect.length - 1; i++) {
      if (ruleCollisionditect[i] != ruleCollisionditect[i + 1]) {
        alert(
          "rule collision detect! id = " +
            this.id +
            "\n" +
            ruleCollisionditect[i] +
            ": " +
            nowAlgo.getRule()[ruleCollisionditect[i]].toString() +
            "\n" +
            ruleCollisionditect[i + 1] +
            ": " +
            nowAlgo.getRule()[ruleCollisionditect[i + 1]].toString()
        );
        if (intervalId) {
          clearInterval(intervalId); // タイマーが動いている場合は停止する
          intervalId = null; // タイマーIDをクリアする
          document.getElementById("AAA").value = "AutoMode start";
        }
      }
    }
  }

  movePhase() {
    if (this.nextgo[0] == 0 && this.nextgo[1] == 0 && this.nextLight == this.light) {
    } else {
      c.RTB_RM(this.x, this.y, this.id);
      c.setRTB(this.x + this.nextgo[0], this.y + this.nextgo[1], this.id);
      this.x += this.nextgo[0];
      this.y += this.nextgo[1];
      pairArray[pairArrayID(this.id)].setLight(this.nextLight);
    }
  }

  getID() {
    return this.id;
  }
  setID(id) {
    this.id = id;
  }
  getX() {
    return this.x;
  }
  setX(x) {
    this.x = x;
  }
  getY() {
    return this.y;
  }
  setY(y) {
    this.y = y;
  }
  getLight() {
    return this.light;
  }

  setLight(light) {
    this.light = light;
    this.nextLight = light;
  }

  ruleMaker(move, light) {
    this.lookPhase();
    this.nextLight = this.light;
    let ret = new Array(9);
    ret[0] = [this.whereIsPair, this.light];
    for (let i = 0; i < ret.length - 2; i++) {
      ret[i + 1] = this.lookCoord[i];
    }
    ret[8] = [move, light];
    console.log(ret);
  }

  setcp(rob) {
    this.setID(rob.getID());
    this.setX(rob.getX());
    this.setY(rob.getY());
    this.setLight(rob.getLight());
  }
}

function compare(tmp, rule) {
  if (nowAlgo.getIsLight()) {
    for (let i = 0; i < tmp.length; i++) {
      if (
        tmp[i][0] != Math.ceil(rule[i][0]) &&
        tmp[i][0] != Math.floor(rule[i][0]) &&
        rule[i][0] != "A" &&
        !(rule[i][0] == "Z" && tmp[i][0] >= 0) &&
        !(
          rule[i][0] == "o" &&
          (tmp[i][0] == -1 || (tmp[i][0] == 2 && tmp[i][1] == 1 && tmp[i][2] == 1))
        ) &&
        !(
          rule[i][0] == "!o" &&
          !(tmp[i][0] == -1 || (tmp[i][0] == 2 && tmp[i][1] == 1 && tmp[i][2] == 1))
        ) &&
        !(
          rule[i][0] == "r" && //ライト1はObj扱い
          (tmp[i][0] == 1 || (tmp[i][0] == 2 && tmp[i][1] != 1 && tmp[i][2] != 1))
        ) &&
        !(
          rule[i][0] == "!r" &&
          !(tmp[i][0] == 1 || (tmp[i][0] == 2 && tmp[i][1] != 1 && tmp[i][2] != 1))
        ) &&
        !(rule[i][0] == "2" && tmp[i][0] == 2 && tmp[i][1] != 1 && tmp[i][2] != 1) &&
        !(
          rule[i][0] == "!r-3" &&
          !(
            (tmp[i][0] == 1 && tmp[i][1] != 3) ||
            (tmp[i][0] == 2 && tmp[i][1] != 1 && tmp[i][2] != 1 && tmp[i][1] != 3 && tmp[i][2] != 3)
          )
        )
      ) {
        return false;
      }
      if (typeof rule[i][0] === "number" && rule[i].length > 1) {
        if (!(tmp[i].slice(1).sort().toString() === rule[i].slice(1).sort().toString())) {
          return false;
        }
      }
    }
    return true;
  } else {
    for (let i = 0; i < tmp.length; i++) {
      if (
        tmp[i][0] != Math.ceil(rule[i]) &&
        tmp[i][0] != Math.floor(rule[i]) &&
        rule[i][0] != "A"
      ) {
        return false;
      }
    }
    return true;
  }
}

function dct2xy(i) {
  switch (i) {
    case 0:
      return [0, 0];
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
  alert("error function xy2dct");
  return 0;
}

function id2light(id) {
  return pairArray[pairArrayID(id)].light;
}
