class Robot {
  //相対座標で入力
  constructor(x, y, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.lookCoord = new Array(7); //int[7]
    //   3 2
    //  4 0 1
    //   5 6
    this.nextgo = [0, 0]; //(x,y)
    this.whereispair = 0; //相方の位置
    this.lookCoord2 = new Array(12);
    //    4 3 2
    //   5 x x 1
    //  6 x X x 0
    //   7 x x 11
    //    8 9 10
    this.nextgoList = [];
    setrtb_relative(x, y, id);
  }

  //rtb配列の頭に0が入ってる前提で進めてるgm仕様
  lookPhase() {
    let surrounding = [
      getrtb_relative(this.x, this.y),
      getrtb_relative(this.x + 1, this.y),
      getrtb_relative(this.x, this.y + 1),
      getrtb_relative(this.x - 1, this.y + 1),
      getrtb_relative(this.x - 1, this.y),
      getrtb_relative(this.x, this.y - 1),
      getrtb_relative(this.x + 1, this.y - 1),
    ];

    let surrounding2 = [
      getrtb_relative(this.x + 2, this.y),
      getrtb_relative(this.x + 1, this.y + 1),
      getrtb_relative(this.x, this.y + 2),
      getrtb_relative(this.x - 1, this.y + 2),
      getrtb_relative(this.x - 2, this.y + 2),
      getrtb_relative(this.x - 2, this.y + 1),
      getrtb_relative(this.x - 2, this.y),
      getrtb_relative(this.x - 1, this.y - 1),
      getrtb_relative(this.x, this.y - 2),
      getrtb_relative(this.x + 1, this.y - 2),
      getrtb_relative(this.x + 2, this.y - 2),
      getrtb_relative(this.x + 2, this.y - 1),
    ];

    if (DD == "week") {
      for (let i = 0; i < surrounding.length; i++) {
        this.lookCoord[i] =
          (surrounding[i].length > 3 ? 3 : surrounding[i].length) - 1;
      }
      for (let i = 0; i < surrounding2.length; i++) {
        this.lookCoord2[i] =
          (surrounding2[i].length > 3 ? 3 : surrounding2[i].length) - 1;
      }
    } else {
      for (let i = 0; i < surrounding.length; i++) {
        this.lookCoord[i] = surrounding[i].length - 1;
      }
      for (let i = 0; i < surrounding2.length; i++) {
        this.lookCoord2[i] = surrounding2[i].length - 1;
      }
    }

    //自分の周りだけを調べて、周りに相方がいなければ、short状態
    this.whereispair = 0;
    for (let i = 1; i < surrounding.length; i++) {
      for (let j = 0; j < surrounding[i].length; j++) {
        if (surrounding[i][j] == this.id) {
          this.whereispair = i;
          break;
        }
      }
    }
  }

  computePhase() {
    this.nextgo = [0, 0];
    let now = [];
    now.push(this.whereispair);
    now = now.concat(this.lookCoord);

    if (nowAlgo == R_LEP_2hop) {
      for (let i = 0; i < nowAlgo.length; i++) {
        if (compare(now, nowAlgo[i])) {
          if (i >= 6 && i <= 11) {
            let N = nowAlgo[i][Math.round(Math.random()) + 8];
            this.nextgo[0] = N[0];
            this.nextgo[1] = N[1];
          } else {
            this.nextgo[0] = nowAlgo[i][8];
            this.nextgo[1] = nowAlgo[i][9];
            switch (i) {
              case 12:
                if (this.lookCoord2[1] < 2 || this.lookCoord2[3] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              case 13:
                if (this.lookCoord2[3] < 2 || this.lookCoord2[5] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              case 14:
                if (this.lookCoord2[5] < 2 || this.lookCoord2[7] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              case 15:
                if (this.lookCoord2[7] < 2 || this.lookCoord2[9] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              case 16:
                if (this.lookCoord2[9] < 2 || this.lookCoord2[11] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              case 17:
                if (this.lookCoord2[11] < 2 || this.lookCoord2[1] < 2) {
                  this.nextgo = [0, 0];
                }
                break;
              default:
                // this.nextgo[0] = nowAlgo[i][8];
                // this.nextgo[1] = nowAlgo[i][9];
                break;
            }
          }
        }
      }
    } else if (nowAlgo == R_LEP_x_polygon || nowAlgo == R_makeLine_x) {
      for (let i = 0; i < nowAlgo.length; i++) {
        if (compare(now, nowAlgo[i])) {
          // console.log(this.id + ": rule " + i);
          if (i == 0) {
            let N = nowAlgo[i][Math.round(Math.random()) + 8];
            this.nextgo[0] = N[0];
            this.nextgo[1] = N[1];
          } else {
            this.nextgo[0] = nowAlgo[i][8];
            this.nextgo[1] = nowAlgo[i][9];
          }
          break;
        }
      }
    } else {
      for (let i = 0; i < nowAlgo.length; i++) {
        if (compare(now, nowAlgo[i])) {
          this.nextgo[0] = nowAlgo[i][8];
          this.nextgo[1] = nowAlgo[i][9];
          // console.log(this.id + ": rule " + i);
          break;
        }
      }
    }
  }

  movePhase() {
    if (this.nextgo[0] == 0 && this.nextgo[1] == 0) {
      return false;
    }
    rm_relative(this.x, this.y, this.id);
    setrtb_relative(this.x + this.nextgo[0], this.y + this.nextgo[1], this.id);
    this.x += this.nextgo[0];
    this.y += this.nextgo[1];
    return !(this.nextgo[0] == 0 && this.nextgo[1] == 0);
  }
}

function compare(now, rule) {
  for (let i = 0; i < now.length; i++) {
    if (
      now[i] != Math.ceil(rule[i]) &&
      now[i] != Math.floor(rule[i]) &&
      rule[i] != "A" &&
      !(rule[i] == "OD" && (now[i] == 2 || now[i] == 0)) &&
      !(rule[i] == "2<=" && now[i] <= 2) &&
      !(rule[i] == "3>=" && now[i] >= 3) &&
      !(rule[i] == "3<=" && now[i] <= 3) &&
      !(rule[i] == "2>=" && now[i] >= 2)
    ) {
      return false;
    }
  }
  return true;
}
