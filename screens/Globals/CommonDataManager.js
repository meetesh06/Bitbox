export default class CommonDataManager {
  static myInstance = null;

  _masterKey = '';

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
}
