export default class CommonDataManager {
  static myInstance = null;

  _masterKey = '';
  _saltUsed = null;
  _username = null;
  _email = null;
  _age = null;

  /**
   * @returns {CommonDataManager} singleton
   */
  static getInstance() {
    if (CommonDataManager.myInstance == null) {
      CommonDataManager.myInstance = new CommonDataManager();
    }
    return this.myInstance;
  }

  getMasterKey() {
    return this._masterKey;
  }

  setMasterKey(key) {
    this._masterKey = key;
  }

  getSaltStatus() {
    return this._saltUsed;
  }

  setSaltStatus(salt) {
    this._saltUsed = salt;
  }

  getUsername() {
    return this._username;
  }
  setUsername(name) {
    this._username = name;
  }

  getEmail() {
    return this._email;
  }

  setEmail(email) {
    this._email = email;
  }

  getAge() {
    return this._age;
  }

  setAge(age) {
    this._age = age;
  }
}
