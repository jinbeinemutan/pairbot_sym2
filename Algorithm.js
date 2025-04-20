class Algorithm {
  constructor(name, sync, isChirality, axisAgreement, rule, isLight) {
    this.name = name;
    this.sync = sync; //string
    this.isChirality = isChirality; //bool
    this.axisAgreement = axisAgreement; //int
    this.rule = rule; // List[][]
    this.isLight = isLight; // bool
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
  getIsChirality() {
    return this.isChirality;
  }
  setIsChirality(isChirality) {
    this.isChirality = isChirality;
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
  setIsLight(bool) {
    this.isLight = bool;
  }
  getIsLight() {
    return this.isLight;
  }
  setAll(tmp) {
    this.setSync(tmp.getSync());
    this.setIsChirality(tmp.getIsChirality());
    this.setAxiAgreement(tmp.getAxiAgreement());
    this.setRule(tmp.getRule());
    this.setIsLight(tmp.getIsLight());
  }
}
