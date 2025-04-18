//global 変数
const w = 1500;
const h = 600;
const a = 30; //1:2:Math.sqrt(3)の1
const w_ofset = ((h / 2) * Math.sqrt(3)) / 3;
const RTB_h = 17;
const RTB_w = 35;

class Canvas {
  constructor() {
    //make RTB[x][y][N_robot]
    this.RTB = new Array(RTB_w); //21

    for (let i = 0; i < RTB_w; i++) {
      this.RTB[i] = new Array(RTB_h);
    }
    for (let i = 0; i < RTB_w; i++) {
      for (let j = 0; j < RTB_h; j++) {
        this.RTB[i][j] = new Array(1).fill(0);
      }
    }
  }
  drawGrid() {
    ctx.clearRect(0, 0, w, h);

    //drawing bold line
    // ctx.strokeStyle = "black";
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    // ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2 + w_ofset, 0);
    ctx.lineTo(w / 2 - w_ofset, h);
    ctx.stroke();

    //drawing thin line
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    let half_h = h / 2;
    while (half_h > 0) {
      half_h -= a * Math.sqrt(3);
      ctx.beginPath();
      ctx.moveTo(0, half_h);
      ctx.lineTo(w, half_h);
      ctx.moveTo(0, h - half_h);
      ctx.lineTo(w, h - half_h);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(w / 2 - w_ofset, 0);
    ctx.lineTo(w / 2 + w_ofset, h);
    ctx.stroke();

    let half_w = w / 2;
    while (half_w + w_ofset > 0) {
      half_w -= 2 * a;
      ctx.beginPath();
      ctx.moveTo(half_w + w_ofset, 0);
      ctx.lineTo(half_w - w_ofset, h);
      ctx.moveTo(w - half_w + w_ofset, 0);
      ctx.lineTo(w - half_w - w_ofset, h);
      //
      ctx.moveTo(half_w - w_ofset, 0);
      ctx.lineTo(half_w + w_ofset, h);
      ctx.moveTo(w - half_w - w_ofset, 0);
      ctx.lineTo(w - half_w + w_ofset, h);
      ctx.stroke();
    }
  }
  drawPairbotLine() {
    for (let i = 0; i < pairArray.length; i++) {
      if (pairArray[i].getIsLong()) {
        let robAx = pairArray[i].robA.x;
        let robAy = pairArray[i].robA.y;
        let robBx = pairArray[i].robB.x;
        let robBy = pairArray[i].robB.y;
        //力技
        let pileAOfNode = //robAのいる座標の下に何台ロボットがいるか調べる
          this.RTB[Math.floor(RTB_w / 2) + robAx][
            Math.floor(RTB_h / 2) + robAy
          ];
        let tmp;
        for (tmp = 1; tmp < pileAOfNode.length; tmp++) {
          //RTBは最初から0が入っている(gm)
          if (pileAOfNode[tmp] == pairArray[i].id) {
            break;
          }
        }
        let pileBOfNode = //robBのいる座標の下に何台ロボットがいるか調べる
          this.RTB[Math.floor(RTB_w / 2) + robBx][
            Math.floor(RTB_h / 2) + robBy
          ];
        let foo;
        for (foo = 1; foo < pileBOfNode.length; foo++) {
          //RTBは最初から0が入っている(gm)
          if (pileBOfNode[foo] == pairArray[i].id) {
            break;
          }
        }
        let pileA = tmp - 1;
        let pileB = foo - 1;

        //draw Line

        ctx.lineWidth = 13;
        ctx.strokeStyle = num2color(pairArray[i].light);
        ctx.beginPath();
        ctx.moveTo(
          w / 2 + a * (robAx * Math.round(Math.sqrt(3)) + robAy),
          h / 2 - robAy * a * Math.sqrt(3) - pileA * 10
        );
        ctx.lineTo(
          w / 2 + a * (robBx * Math.round(Math.sqrt(3)) + robBy),
          h / 2 - robBy * a * Math.sqrt(3) - pileB * 10
        );
        ctx.stroke();
        ctx.lineWidth = 9;
        ctx.strokeStyle = pairArray[i].color;
        ctx.beginPath();
        ctx.moveTo(
          w / 2 + a * (robAx * Math.round(Math.sqrt(3)) + robAy),
          h / 2 - robAy * a * Math.sqrt(3) - pileA * 10
        );
        ctx.lineTo(
          w / 2 + a * (robBx * Math.round(Math.sqrt(3)) + robBy),
          h / 2 - robBy * a * Math.sqrt(3) - pileB * 10
        );
        ctx.stroke();
      }
    }
  }
  drawRobot() {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    for (let i = 0; i < this.RTB.length; i++) {
      for (let j = 0; j < this.RTB[i].length; j++) {
        let pile = 0;
        for (let k = 0; k < this.RTB[i][j].length; k++) {
          if (this.RTB[i][j][k] > 0) {
            ctx.strokeStyle = num2color(pairArray[this.RTB[i][j][k] - 1].light);
            ctx.fillStyle = pairArray[this.RTB[i][j][k] - 1].color;
            let x = i - Math.floor(RTB_w / 2);
            let y = j - Math.floor(RTB_h / 2);
            ctx.beginPath();
            ctx.arc(
              w / 2 + a * (x * Math.round(Math.sqrt(3)) + y),
              h / 2 - y * a * Math.sqrt(3) - pile * 10,
              18,
              0,
              Math.PI * 2
            );
            ctx.stroke();
            ctx.fill();
            if (isCheet) {
              ctx.fillStyle = "black";
              ctx.fillText(
                this.RTB[i][j][k],
                w / 2 + a * (x * Math.round(Math.sqrt(3)) + y),
                h / 2 - y * a * Math.sqrt(3) - pile * 10
              );
            }
            pile++;
          } else if (this.RTB[i][j][k] < 0) {
            ctx.fillStyle = "#000000";
            let x = i - Math.floor(RTB_w / 2);
            let y = j - Math.floor(RTB_h / 2);
            // ctx.fillRect(
            //   w / 2 + a * (x * Math.round(Math.sqrt(3)) + y) - 20,
            //   h / 2 - y * a * Math.sqrt(3) - 20,
            //   40,
            //   40
            // );

            hexagon(
              w / 2 + a * (x * Math.round(Math.sqrt(3)) + y) -a/2,
              h / 2 - y * a * Math.sqrt(3) -a*Math.sqrt(3)/2,
              a
            );
          }
        }
      }
    }
  }
  setRTB(x, y, id) {
    this.RTB[x + Math.floor(RTB_w / 2)][y + Math.floor(RTB_h / 2)].push(id);
  }
  getRTB(x, y) {
    return this.RTB[x + Math.floor(RTB_w / 2)][y + Math.floor(RTB_h / 2)];
  }
  RTB_RM(x, y, id) {
    for (
      let i = 0;
      i < this.RTB[x + Math.floor(RTB_w / 2)][y + Math.floor(RTB_h / 2)].length;
      i++
    ) {
      if (
        this.RTB[x + Math.floor(RTB_w / 2)][y + Math.floor(RTB_h / 2)][i] == id
      ) {
        this.RTB[x + Math.floor(RTB_w / 2)][y + Math.floor(RTB_h / 2)].splice(
          i,
          1
        );
        break;
      }
    }
  }
}

function num2color(n) {
  switch (n) {
    case 0:
      return "#000000";
    case 1:
      return "#ff0000";
    case 2:
      return "#00ff00";
    case 3:
      return "#0000ff";
    case 4:
      return "#ff00ff";
    case 5:
      return "#00ffff";
    case 6:
      return "#ffff00";
    default:
      return "#000000";
  }
}

function hexagon(posx, posy, length) {
  ctx.beginPath();
  ctx.moveTo(posx, posy);
  ctx.lineTo(posx + length, posy);
  ctx.lineTo(posx + length + length / 2, posy + (Math.sqrt(3) * length) / 2);
  ctx.lineTo(
    posx + length,
    posy + (Math.sqrt(3) * length) / 2 + (Math.sqrt(3) * length) / 2
  );
  ctx.lineTo(
    posx,
    posy + (Math.sqrt(3) * length) / 2 + (Math.sqrt(3) * length) / 2
  );
  ctx.lineTo(posx - length / 2, posy + (Math.sqrt(3) * length) / 2);
  ctx.lineTo(posx, posy);
  ctx.stroke();
}
