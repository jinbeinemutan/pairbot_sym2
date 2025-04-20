let R_LEP_x = [
  //rule1
  [0, 2, 0, 2, "A", "A", "A", 2, 1],
  //rule4
  [0, 2, 1, "A", "A", "A", "A", "A", 1],
  //rule6
  [0, 2, 0, 1, 0, "A", "A", "A", 1],
  [0, 2, 0, "A", "A", "A", 0, 1, 1],
  //rule2
  [1, 1, 1, "A", 0, 0, 1.5, 1.5, 1],
  [1, 1, 1, 1.5, 1.5, 0, 0, "A", 1],
  //rule3
  [1, 1, 1, "A", 0, 0, 0, "A", 1],
  //rule5
  [1, 1, 1, 1.5, 1.5, 0, 1.5, 1.5, 1],
  //rule5
  [1, 2, 1, "A", "A", "A", "A", "A", 1],
];

let R_makeLine_xy = [
  [0, 2, 0.5, 0, 0, "A", "A", 1.5, 1],
  [0, 2, "A", 0, 0, "A", 1.5, 0, 6],
  [0, 2, 1, 0, 0, "A", 0, 0, 6],
  [1, 2, 1, 0, 0, 1.5, "A", "A", 1],
  [1, 1, 1, 0, 0, 0, "A", 1.5, 1],
  [6, 2, "A", 0, 0, 1.5, 1.5, 1, 6],
  [6, 1, "A", 0, 0, 0, "A", 1, 6],
];

let testLightRule = [
  [[0, 0], [2, 0, 0], [0], [-1], [-1], [-1], [-1], [-1], [1, 1]],
  [[1, 1], [1, 1], [1, 1], [-1], [-1], [-1], [-1], [-1], [1, 0]],

  [[1, 0], [2, 0, 1], [1, 0], [0], [0], [1, 1], [0], [0], [1, 1]],
  [[1, 1], [1, 1], [1, 1], [0], [0], [0], [0], [0], [1, 3]],
  [[2, 0], [1, 0], [1, 1], [1,0], [-1], [0], [0], [1,1], [2, 3]],
];

function makeRuleChirality(rule) {
  let ret = new Array(6);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = new Array(9);
  }
  for (let i = 0; i < ret.length; i++)
    for (let j = 0; j < ret[i].length; j++) {
      ret[i][j] = [];
    }
  if (rule[0][0] == 0) {
    for (let i = 0; i < 6; i++) {
      ret[i][0].push(0);
      ret[i][0].push(rule[0][1]);
    }
  } else {
    for (let i = 0; i < ret.length; i++) {
      ret[i][0].push(place2num(rule[0][0] + i + 1));
      ret[i][0].push(rule[0][1]);
    }
  }
  for (let i = 0; i < ret.length; i++) {
    ret[i][1] = rule[1].slice();
  }
  for (let i = 0; i < ret.length; i++) {
    for (let j = 2; j <= 7; j++) {
      ret[i][j] = rule[ttt(j - 1 - i)].slice();
    }
  }

  for (let i = 0; i < ret.length; i++) {
    ret[i][8].push(place2num(rule[8][0] + i + 1));
    ret[i][8].push(rule[8][1]);
  }
  return ret;
}

function makeRuleSymmetry(rule) {
  let ret = new Array(9);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = [];
  }

  //相手の位置と色

  ret[0].push(Xsymmetry(rule[0][0]));
  ret[0].push(rule[0][1]);

  //自分の位置と色そのままCP

  ret[1] = rule[1].slice();

  for (let j = 2; j <= 7; j++) {
    ret[j] = rule[Xsymmetry(j - 1) + 1].slice();
  }

  ret[8].push(Xsymmetry(rule[8][0]));
  ret[8].push(rule[8][1]);
  return ret;
}

function place2num(n) {
  return ((n - 1) % 6) + 1;
}

function ttt(x) {
  if (x > 7) {
    return ttt(x - 6);
  }
  if (x < 2) {
    return ttt(x + 6);
  }
  return x;
}

function Xsymmetry(x) {
  switch (x) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 6;
    case 3:
      return 5;
    case 4:
      return 4;
    case 5:
      return 3;
    case 6:
      return 2;
  }
}
