class Algorithm {
  constructor(name, sync, isChirality, axisAgreement, rule, isLight, NLight, LightType) {
    this.name = name;
    this.sync = sync; //string
    this.isChirality = isChirality; //bool
    this.axisAgreement = axisAgreement; //int
    this.rule = rule; // List[][]
    this.isLight = isLight; // bool
    this.NLight = NLight; // int
    this.LightType = LightType; // internal = 1,external = 2, full = 3
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

  getNLight() {
    return this.NLight;
  }

  setNLight(x) {
    this.NLight = x;
  }

  getLightType() {
    return this.LightType;
  }
  setLightType(x) {
    this.LightType = x;
  }

  setAll(tmp) {
    this.setSync(tmp.getSync());
    this.setIsChirality(tmp.getIsChirality());
    this.setAxiAgreement(tmp.getAxiAgreement());
    this.setRule(tmp.getRule());
    this.setIsLight(tmp.getIsLight());
    this.setNLight(tmp.getNLight());
    this.setLightType(tmp.getLightType());
  }
}
