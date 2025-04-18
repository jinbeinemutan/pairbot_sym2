class Algorithm {
  constructor(name) {
    this.name = name; //string
    this.sync; //string
    this.duplicationDetectio; //string "week" or "strong"
    this.isChirality; //bool
    this.view; //int
    this.axisAgreement; //int
    this.rule; // List[][]
  }

  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getSync() {
    return this.sync;
  }
  setSync(sync) {
    this.sync = sync;
  }
  getDuplicationDetection() {
    return this.duplicationDetection;
  }
  setDuplicationDetection(dd) {
    this.duplicationDetection = dd;
  }
  getIsChirality() {
    return this.isChirality;
  }
  setIsChirality(isChirality) {
    this.isChirality = isChirality;
  }
  getView() {
    return this.view;
  }
  setView(view) {
    this.view = view;
  }
  getAxiAgreement() {
    return this.axisAgreement;
  }
  setAxiAgreement(x) {
    this.axisAgreement = x;
  }
  getRule() {
    return this.rule;
  }
  setRule(rule) {
    this.rule = rule;
  }
}
