const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

let c = new Canvas(); // canvasの初期化&RTB
let cp = new Canvas();

let pairArray = []; //全てのpairbotを格納してるリスト

let nowAlgo = new Algorithm("nowAlgo", "F", true, 0, FillnCoverExRule, true);
let AlgoLepX = new Algorithm("AlgoLepX", "S", false, 1, R_LEP_x, false);
let AlogMakeLine = new Algorithm("AlogMakeLine", "S", false, 2, R_makeLine_xy, false);
let Algofilling = new Algorithm("Algofilling", "S", true, 0, testLightRule, true);
let AlgoFillnCoverEx = new Algorithm("AlgoFillingnCoverEx", "S", true, 0, FillnCoverExRule, true);

var intervalId;
let isCheet = false;
let globalColor = "#ffffff";
let longdirct = [0, 0];
let isleaderColoring = false;
let keypress = false;
let globalLight = 0;
let ispairbotPool = true;
let idcounter = 1;

let pairArrayCP = [];

c.drawGrid();
c.drawPool();

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  let yh = Math.round((h / 2 - y) / (a * Math.sqrt(3)));
  let xw = Math.round((x - w / 2 - a * yh) / (2 * a));
  if (ColorSelect.options[0].selected) {
    setGlobalColor();
  }

  if (event.ctrlKey) {
    let tmp = c.getRTB(xw, yh);
    let leng = tmp.length;
    for (let i = 1; i < leng; i++) {
      let deleteID = tmp[i];
      if (deleteID == -1) {
        c.RTB_RM(xw, yh, deleteID);
      } else {
        let int = pairArrayID(deleteID);
        if (pairArray[int].getIsLong()) {
          let robAx = pairArray[int].robA.x;
          let robAy = pairArray[int].robA.y;
          let robBx = pairArray[int].robB.x;
          let robBy = pairArray[int].robB.y;
          c.RTB_RM(robAx, robAy, deleteID);
          c.RTB_RM(robBx, robBy, deleteID);
        } else {
          c.RTB_RM(xw, yh, deleteID);
          c.RTB_RM(xw, yh, deleteID);
          i++;
        }
        pairArray.splice(int, 1);
      }
    }
  }

  if (c.getRTB(xw, yh).length == 1) {
    if (!keypress) {
      let tmp = new Pairbot(idcounter++, xw, yh, globalColor, longdirct, globalLight);
      pairArray.push(tmp);
      tmp.pairSetRTB();
    } else if (!event.ctrlKey) {
      c.setRTB(xw, yh, -1);
    }
  }

  doDrawFuncs();
});

document.addEventListener("keydown", function (event) {
  keypress = true;
});

document.addEventListener("keyup", function (event) {
  keypress = false;
});

document.getElementById("round").onsubmit = function (event) {
  event.preventDefault();
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  }
  LCM();
};

document.getElementById("all_delete").onsubmit = function (event) {
  event.preventDefault();
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  }
  pairArray = [];
  idcounter = 1;
  // RTBArray.length = 1;
  for (let i = 0; i < RTB_w; i++) {
    for (let j = 0; j < RTB_h; j++) {
      c.RTB[i][j].length = 1;
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
    intervalId = setInterval(LCM, 1000 - document.getElementById("speed").value); // タイマーが停止している場合は開始する
    document.getElementById("AAA").value = "AutoMode stop";
  }
};

let SyncSelect = document.getElementById("SYNC");
SyncSelect.options[0].selected = true;
SyncSelect.addEventListener("change", function () {
  switch (SyncSelect.value) {
    case "FSYNC":
      nowAlgo.setSync("F");
      break;
    case "SSYNC":
      nowAlgo.setSync("S");
      break;
    case "ASYNC":
      nowAlgo.setSync("A");
      break;
    default:
      window.alert("error: none of SYNC.value is selected");
  }
});

let AlgoSelect = document.getElementById("myAlgo");
AlgoSelect.options[3].selected = true;
AlgoSelect.addEventListener("change", function () {
  switch (AlgoSelect.value) {
    case "LEP_x":
      nowAlgo.setRule(R_LEP_x);
      nowAlgo.setSync("S");
      nowAlgo.setIsLight(false);
      nowAlgo.setIsChirality(false);
      SyncSelect.options[1].selected = true;
      break;
    case "line_xy":
      nowAlgo.setRule(R_makeLine_xy);
      nowAlgo.setSync("F");
      SyncSelect.options[0].selected = true;
      nowAlgo.setIsLight(false);
      nowAlgo.setIsChirality(false);
      break;
    case "lightest":
      nowAlgo.setAll(Algofilling);

      break;
    case "Extest":
      nowAlgo.setRule(FillnCoverExRule);
      nowAlgo.setIsLight(true);
      nowAlgo.setIsChirality(true);

      break;
    default:
      window.alert("error: none of MyAlgo.value is selected");
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

let PairbotLightSelect = document.getElementById("PairbotLight");
PairbotLightSelect.options[0].selected = true;
PairbotLightSelect.addEventListener("change", function () {
  switch (PairbotLightSelect.value) {
    case "0":
      globalLight = 0;
      break;
    case "1":
      globalLight = 1;
      break;
    case "2":
      globalLight = 2;
      break;
    case "3":
      globalLight = 3;
      break;
    case "4":
      globalLight = 4;
      break;
    case "5":
      globalLight = 5;
      break;
    case "6":
      globalLight = 6;
      break;
    default:
      window.alert("error: none of PairbotLightSelect.value is selected");
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

let memorySelect = document.getElementById("memory");
memorySelect.options[0].selected = true;
memorySelect.addEventListener("change", function () {
  if (intervalId) {
    clearInterval(intervalId); // タイマーが動いている場合は停止する
    intervalId = null; // タイマーIDをクリアする
    document.getElementById("AAA").value = "AutoMode start";
  }
  pairArray = [];
  idcounter = 1;
  for (let i = 0; i < RTB_w; i++) {
    for (let j = 0; j < RTB_h; j++) {
      c.RTB[i][j].length = 1;
    }
  }
  switch (memorySelect.value) {
    case "test1":
      RTB_CP(RTB_MEM2, c.getAll());
      ArrayCP(pairArrayCP, pairArray);
      break;
    case "test2":
      RTB_CP(cp.getAll(), c.getAll());
      ArrayCP(pairArrayCP, pairArray);
      break;
    default:
    // window.alert("error: none of memory.value is selected");
  }
  idcounter = pairArray.length + 1;
  doDrawFuncs();
});

function setGlobalColor() {
  switch ((idcounter + 1) % 8) {
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
  c.drawGrid();
  c.drawPool();
  IsLeader();
  c.drawPairbotLine();
  c.drawRobot();
}

function LCM() {
  if (nowAlgo.getSync() == "A") {
    for (let i = 0; i < 3; i++) {
      let r = Math.floor(Math.random() * pairArray.length);
      pairArray[r].ActAsyncPhase();
    }
  } else {
    if (nowAlgo.getSync() == "F") {
      for (let i = 0; i < pairArray.length; i++) {
        pairArray[i].isActivate = true;
      }
    } else if (nowAlgo.getSync() == "S") {
      for (let i = 0; i < pairArray.length; i++) {
        pairArray[i].isActivate = randomBoolean = (() => Math.random() >= 0.5)();
      }
    }

    for (let i = 0; i < pairArray.length; i++) {
      if (pairArray[i].isActivate) {
        pairArray[i].pairLookPhase();
        pairArray[i].pairComputePhase();
      }
    }

    for (let i = 0; i < pairArray.length; i++) {
      if (pairArray[i].isActivate) {
        pairArray[i].pairMovePhase();
      }
    }
  }
  pairbotPool(-12, 0);
  doDrawFuncs();
}

function IsLeader() {
  if (nowAlgo.getRule() == R_LEP_x && isleaderColoring) {
    for (let i = 0; i < pairArray.length; i++) {
      let x = pairArray[i].robA.x;
      let y = pairArray[i].robA.y;
      if (!pairArray[i].getIsLong()) {
        if (
          c.getRTB(x + 1, y).length == 1 &&
          c.getRTB(x, y + 1).length == 1 &&
          c.getRTB(x + 1, y - 1).length == 1
        ) {
          pairArray[i].color = "red";
        } else {
          pairArray[i].color = "#CCCCCC";
        }
      }
    }
  }
}

function pairbotPool(x, y) {
  if (ColorSelect.options[0].selected) {
    setGlobalColor();
  }
  if (c.getRTB(x, y).toString() === [0].toString()) {
    let tmp = new Pairbot(idcounter++, x, y, globalColor, [0, 0], 0);
    pairArray.push(tmp);
    tmp.pairSetRTB();
  }
}

function pairArrayID(id) {
  let i = 0;
  for (i; i < pairArray.length; i++) {
    if (pairArray[i].getID() == id) {
      return i;
    }
  }
  console.log("error:function pairArrayID is not hit");
  return -1;
}

function ArrayCP(a, b) {
  //aをbにコピー
  for (let i = 0; i < a.length; i++) {
    let pbtmp = new Pairbot(99, 99, 99, 99, [0, 0], 99);
    pbtmp.setAll(a[i]);
    b.push(pbtmp);
  }
}
