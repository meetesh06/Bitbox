export default class CommonDataManager {
  static myInstance = null;

  _masterKey = '';
  _saltUsed = null;
  _username = null;
  _email = null;
  _age = null;
  _remote = false;
  _signedIn = false;
  _masterKeySet = false;
  _remoteUserData = null;
  _signedInSession = false;
  _remoteTokens = null;
  _apiToken = '';

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

  getRemote() {
    return this._remote;
  }

  setRemote(remote) {
    this._remote = remote;
  }

  getSignedIn() {
    return this._signedIn;
  }

  setSignedIn(signedIn) {
    this._signedIn = signedIn;
  }

  getMasterKeyStatus() {
    return this._masterKeySet;
  }

  setMasterKeyStatus(status) {
    this._masterKeySet = status;
  }

  getRemoteUserData() {
    return this._remoteUserData;
  }

  setRemoteUserData(data) {
    this._remoteUserData = data;
  }

  getGoogleSignedInSession() {
    return this._signedInSession;
  }

  setGoogleSignedInSession(status) {
    this._signedInSession = status;
  }

  getRemoteTokens() {
    return this._remoteTokens;
  }

  setRemoteTokens(status) {
    this._remoteTokens = status;
  }

  getApiToken() {
    return this._apiToken;
  }

  setApiToken(token) {
    this._apiToken = token;
  }
}
