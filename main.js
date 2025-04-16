//main関数
const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

let c = new Canvas(); // canvasの初期化&rtb
let rtbArray = []; // rtbの履歴(gm)
let pairArray = []; //全てのpairbotを格納してるリスト
let pairArrayHistory = []; //pairArrayの履歴のリスト

var intervalId;

let nowAlgo = R_LEP_x;
let SYNC = "F";
let DD = "strong";
let globalColor = "#ff0000";
let isCheet = false;
let isleaderColoring = false;
let isFreeMode = false;
let longdirct = [0, 0];

c.drawGrid();
c.drawRobot();

// canvasをクリックするとペアボットが出現する
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  let yh = Math.round((h / 2 - y) / (a * Math.sqrt(3)));
  let xw = Math.round((x - w / 2 - a * yh) / (2 * a));
  if (ColorSelect.options[0].selected) {
    setGlobalColor();
  }
  if (isFreeMode) {
    pairArray.push(
      new Pairbot(xw, yh, pairArray.length + 1, globalColor, longdirct)
    );
  } else if (getrtb_relative(xw, yh).length == 1) {
    pairArray.push(
      new Pairbot(xw, yh, pairArray.length + 1, globalColor, [0, 0])
    );

    // pairArrayHistory.push(JSON.parse(JSON.stringify(pairArray)));
    // pairArrayHistory.push(pairArray.map( list => ({...list})));
    // Objectを作り直すしかないか？
    // console.log(pairArrayHistory);
  }
  doDrawFuncs();
});

//test drawing mode
function drawCanvas(x, y) {
  //共通座標系における(x,y)
}

document.getElementById("round").onsubmit = function (event) {
  event.preventDefault();
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  }
  roudn1();
};

document.getElementById("all_delete").onsubmit = function (event) {
  event.preventDefault();
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  }
  pairArray = [];
  pairArrayHistory = [];
  // rtbArray.length = 1;
  for (let i = 0; i < rtb_w; i++) {
    for (let j = 0; j < rtb_h; j++) {
      rtb[i][j].length = 1;
    }
  }
  doDrawFuncs();
};

document.getElementById("auto").onsubmit = function (event) {
  event.preventDefault();
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  } else {
    intervalId = setInterval(
      roudn1,
      1000 - document.getElementById("speed").value
    ); // タイマーが停止している場合は開始する
    document.getElementById("AAA").value = "AutoMode stop";
  }
};

let SyncSelect = document.getElementById("SYNC");
SyncSelect.options[0].selected = true;
SyncSelect.addEventListener("change", function () {
  switch (SyncSelect.value) {
    case "FSYNC":
      SYNC = "F";
      break;
    case "SSYNC":
      SYNC = "S";
      break;
    case "ASYNC":
      SYNC = "A";
      break;
    default:
      window.alert("error: none of SYNC.value is selected");
  }
});

let AlgoSelect = document.getElementById("myAlgo");
AlgoSelect.options[4].selected = true;
AlgoSelect.addEventListener("change", function () {
  switch (AlgoSelect.value) {
    case "makeLine_x":
      nowAlgo = R_makeLine_x;
      break;
    case "LEP_x_polygon":
      nowAlgo = R_LEP_x_polygon;
      break;
    case "LEP_polygon":
      nowAlgo = R_LEP_xy_polygon;
      break;
    case "OSKB":
      nowAlgo = R_OSKB;
      break;
    case "LEP_2hop":
      nowAlgo = R_LEP_2hop;
      break;
    case "LEP_x":
      nowAlgo = R_LEP_x;
      break;
    case "maketriangle":
      nowAlgo = R_maketriangle_xy;
      break;
    case "makeLine":
      nowAlgo = R_makeLine_xy;
      break;
    default:
      window.alert("error: none of MyAlgo.value is selected");
  }
});

let DDSelect = document.getElementById("DuplicationDetection");
DDSelect.options[1].selected = true;
DDSelect.addEventListener("change", function () {
  switch (DDSelect.value) {
    case "strongDD":
      DD = "strong";
      break;
    case "weekDD":
      DD = "week";
      break;
    default:
      window.alert("error: none of DD.value is selected");
  }
});

document.getElementById("cheet").onsubmit = function (event) {
  event.preventDefault();
  if (!isCheet) {
    document.getElementById("cheetbotan").value = "displayID OFF";
  } else {
    document.getElementById("cheetbotan").value = "displayID ON";
  }
  isCheet = !isCheet;
  doDrawFuncs();
};

document.getElementById("leaderColoring").onsubmit = function (event) {
  event.preventDefault();
  if (!isleaderColoring) {
    document.getElementById("leaderColoringbotan").value = "LeaderColoring OFF";
  } else {
    document.getElementById("leaderColoringbotan").value = "LeaderColoring ON";
  }
  isleaderColoring = !isleaderColoring;
  doDrawFuncs();
};

document.getElementById("freeMode").onsubmit = function (event) {
  event.preventDefault();
  let ele = document.getElementById("PairbotConfig");
  if (!isFreeMode) {
    document.getElementById("freeModeBotan").value = "freeMode OFF";
    ele.style.display = 'block'; 
  } else {
    document.getElementById("freeModeBotan").value = "freeMode ON";
    ele.style.display = 'none';
  }
  isFreeMode = !isFreeMode;
};

let PairbotConfigSelect = document.getElementById("PairbotConfig");
PairbotConfigSelect.options[0].selected = true;
PairbotConfigSelect.addEventListener("change", function () {
  switch (PairbotConfigSelect.value) {
    case "0":
      longdirct = [0, 0];
      break;
    case "1":
      longdirct = [0, 1];
      break;
    case "3":
      longdirct = [1, 0];
      break;
    case "5":
      longdirct = [1, -1];
      break;
    case "7":
      longdirct = [0, -1];
      break;
    case "9":
      longdirct = [-1, 0];
      break;
    case "11":
      longdirct = [-1, 1];
      break;
    default:
      window.alert("error: none of PairbotConfig.value is selected");
  }
});

let ColorSelect = document.getElementById("PairbotColor");
ColorSelect.options[0].selected = true;
ColorSelect.addEventListener("change", function () {
  switch (ColorSelect.value) {
    case "all":
      setGlobalColor();
      break;
    case "white":
      globalColor = "#ffffff";
      break;
    case "red":
      globalColor = "red";
      break;
    case "green":
      globalColor = "#00ff00";
      break;
    case "blue":
      globalColor = "#0000ff";
      break;
    case "yellow":
      globalColor = "yellow";
      break;
    case "purple":
      globalColor = "#ff00ff";
      break;
    case "cyan":
      globalColor = "#00ffff";
      break;
    case "grey":
      globalColor = "#CCCCCC";
      break;
    default:
      window.alert("error: none of color.value is selected");
  }
});

function setGlobalColor() {
  switch ((pairArray.length + 1) % 8) {
    case 0:
      globalColor = "#ffffff";
      break;
    case 1:
      globalColor = "red";
      break;
    case 2:
      globalColor = "#00ff00";
      break;
    case 3:
      globalColor = "#0000ff";
      break;
    case 4:
      globalColor = "#ffff00";
      break;
    case 5:
      globalColor = "#ff00ff";
      break;
    case 6:
      globalColor = "#00ffff";
      break;
    case 7:
      globalColor = "#CCCCCC";
      break;
  }
}

function doDrawFuncs() {
  IsLeader();
  c.drawGrid();
  c.drawPairbotLine();
  c.drawRobot();
}
// 仮
function roudn1() {
  if (nowAlgo == R_LEP_2hop && isSolved()) {
    window.alert("note: Leader Election Problem has been solved");
    if (intervalId) {
      clearInterval(intervalId); // タイマーが動いている場合は停止する
      intervalId = null; // タイマーIDをクリアする
      document.getElementById("AAA").value = "AutoMode start";
    }
    return 0;
  }
  if (SYNC == "A") {
    for (let i = 0; i < 3; i++) {
      let r = Math.floor(Math.random() * pairArray.length);
      pairArray[r].ActAsyncPhase();
    }
    doDrawFuncs();
  } else {
    if (SYNC == "F") {
      for (let i = 0; i < pairArray.length; i++) {
        pairArray[i].isActivate = true;
      }
    } else if (SYNC == "S") {
      for (let i = 0; i < pairArray.length; i++) {
        pairArray[i].isActivate = randomBoolean = (() =>
          Math.random() >= 0.5)();
      }
    }

    for (let i = 0; i < pairArray.length; i++) {
      if (pairArray[i].isActivate) {
        pairArray[i].pairLookPhase();
        pairArray[i].pairComputePhase();
      }
    }

    // rtbArray.push(JSON.parse(JSON.stringify(rtb)));
    // console.log(rtbArray);

    // pairArrayHistory.push(JSON.parse(JSON.stringify(pairArray)));
    // pairArrayHistory.push(pairArray.map( list => ({...list})));
    // console.log(pairArrayHistory);
    for (let i = 0; i < pairArray.length; i++) {
      if (pairArray[i].isActivate) {
        pairArray[i].pairMovePhase();
      }
    }
    doDrawFuncs();

    console.log("\n");
  }
}

function IsLeader() {
  if (nowAlgo == R_LEP_x && isleaderColoring) {
    for (let i = 0; i < pairArray.length; i++) {
      let x = pairArray[i].robA.x;
      let y = pairArray[i].robA.y;
      if (!pairArray[i].getIsLong()) {
        if (
          getrtb_relative(x + 1, y).length == 1 &&
          getrtb_relative(x, y + 1).length == 1 &&
          getrtb_relative(x + 1, y - 1).length == 1
        ) {
          pairArray[i].color = "red";
        } else {
          pairArray[i].color = "#CCCCCC";
        }
      }
    }
  }
}

function pairArrayToRrtb(pairArray) {
  //  JSON.parse(JSON.stringify(pairArray));
  for (let i = 0; i < rtb_w; i++) {
    for (let j = 0; j < rtb_h; j++) {
      rtb[i][j] = [0];
    }
  }
  for (let i = 0; i < pairArray.length; i++) {
    setrtb_relative(
      pairArray[i].robA.x,
      pairArray[i].robA.y,
      pairArray[i].robA.id
    );
    setrtb_relative(
      pairArray[i].robB.x,
      pairArray[i].robB.y,
      pairArray[i].robB.id
    );
  }
}

// 簡易型 非連結で2グループを同時にやろうとすると終わる
function isSolved() {
  let shortcount = [];
  for (let i = 0; i < pairArray.length; i++) {
    if (!pairArray[i].getIsLong()) {
      shortcount.push(i);
    }
  }
  if (shortcount.length <= 3) {
    if (shortcount.length < 3) {
      return true;
    }
    return !(
      Math.abs(
        pairArray[shortcount[0]].robA.x - pairArray[shortcount[1]].robA.x
      ) +
        Math.abs(
          pairArray[shortcount[0]].robA.y - pairArray[shortcount[1]].robA.y
        ) >
        2 ||
      Math.abs(
        pairArray[shortcount[1]].robA.x - pairArray[shortcount[2]].robA.x
      ) +
        Math.abs(
          pairArray[shortcount[1]].robA.y - pairArray[shortcount[2]].robA.y
        ) >
        2 ||
      Math.abs(
        pairArray[shortcount[2]].robA.x - pairArray[shortcount[0]].robA.x
      ) +
        Math.abs(
          pairArray[shortcount[2]].robA.y - pairArray[shortcount[0]].robA.y
        ) >
        2 ||
      Math.abs(
        pairArray[shortcount[0]].robA.x -
          pairArray[shortcount[1]].robA.x +
          pairArray[shortcount[0]].robA.y -
          pairArray[shortcount[1]].robA.y
      ) > 1 ||
      Math.abs(
        pairArray[shortcount[0]].robA.x -
          pairArray[shortcount[2]].robA.x +
          pairArray[shortcount[0]].robA.y -
          pairArray[shortcount[2]].robA.y
      ) > 1 ||
      Math.abs(
        pairArray[shortcount[2]].robA.x -
          pairArray[shortcount[1]].robA.x +
          pairArray[shortcount[2]].robA.y -
          pairArray[shortcount[1]].robA.y
      ) > 1
    );
  } else {
    return false;
  }
}
