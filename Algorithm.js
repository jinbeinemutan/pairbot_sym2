class Algorithm {
  constructor(name, sync, dd, isChirality, view, axisAgreement, rule) {
    this.name = name; //string
    this.sync = sync; //string
    this.duplicationDetection = dd; //string "week" or "strong"
    this.isChirality = isChirality; //bool
    this.view = view; //int
    this.axisAgreement = axisAgreement; //int
    this.rule = rule; // List[][]
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
}
