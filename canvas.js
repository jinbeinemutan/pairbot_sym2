//global 変数
const w = 1500;
const h = 600;
const a = 30; //1:2:Math.sqrt(3)の1
const w_ofset = ((h / 2) * Math.sqrt(3)) / 3;
const rtb_h = 17;
const rtb_w = 35;
let rtb;

class Canvas {
  constructor() {
    //make rtb[x][y][N_robot]
    rtb = new Array(rtb_w); //21
    for (let i = 0; i < rtb_w; i++) {
      rtb[i] = new Array(rtb_h);
    }
    for (let i = 0; i < rtb_w; i++) {
      for (let j = 0; j < rtb_h; j++) {
        rtb[i][j] = new Array(1).fill(0);
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
          rtb[Math.floor(rtb_w / 2) + robAx][Math.floor(rtb_h / 2) + robAy];
        let tmp;
        for (tmp = 1; tmp < pileAOfNode.length; tmp++) {
          //rtbは最初から0が入っている(gm)
          if (pileAOfNode[tmp] == pairArray[i].id) {
            break;
          }
        }
        let pileBOfNode = //robBのいる座標の下に何台ロボットがいるか調べる
          rtb[Math.floor(rtb_w / 2) + robBx][Math.floor(rtb_h / 2) + robBy];
        let foo;
        for (foo = 1; foo < pileBOfNode.length; foo++) {
          //rtbは最初から0が入っている(gm)
          if (pileBOfNode[foo] == pairArray[i].id) {
            break;
          }
        }
        let pileA = tmp - 1;
        let pileB = foo - 1;

        //draw Line
        //カラーの線を引く前にそれより少し太い黒線を引くと縁取られる
        ctx.lineWidth = 13;
        ctx.strokeStyle = "black";
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
    for (let i = 0; i < rtb.length; i++) {
      for (let j = 0; j < rtb[i].length; j++) {
        let pile = 0;
        for (let k = 0; k < rtb[i][j].length; k++) {
          if (rtb[i][j][k] != 0) {
            ctx.fillStyle = pairArray[rtb[i][j][k] - 1].color;
            let x = i - Math.floor(rtb_w / 2);
            let y = j - Math.floor(rtb_h / 2);
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
                rtb[i][j][k],
                w / 2 + a * (x * Math.round(Math.sqrt(3)) + y),
                h / 2 - y * a * Math.sqrt(3) - pile * 10
              );
            }
            pile++;
          }
        }
      }
    }
  }
}

function setrtb_relative(x, y, id) {
  rtb[x + Math.floor(rtb_w / 2)][y + Math.floor(rtb_h / 2)].push(id);
}
function getrtb_relative(x, y) {
  return rtb[x + Math.floor(rtb_w / 2)][y + Math.floor(rtb_h / 2)];
}

function rm_relative(x, y, id) {
  for (
    let i = 0;
    i < rtb[x + Math.floor(rtb_w / 2)][y + Math.floor(rtb_h / 2)].length;
    i++
  ) {
    if (rtb[x + Math.floor(rtb_w / 2)][y + Math.floor(rtb_h / 2)][i] == id) {
      rtb[x + Math.floor(rtb_w / 2)][y + Math.floor(rtb_h / 2)].splice(i, 1);
      break;
    }
  }
}
