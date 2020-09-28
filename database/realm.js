import Realm from 'realm';
import {CREDENTIALS_SCHEMA} from '../screens/Globals/Database';
import CommonDataManager from '../screens/Globals/CommonDataManager';
import {convertStringToByteArray} from '../screens/Globals/Functions';
import {DATABASE_NAME} from '../screens/Globals/AsyncStorageEnum.js';

class Credentials extends Realm.Object {}

Credentials.schema = {
  name: CREDENTIALS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    themeData: 'string',
    title: 'string',
    email: 'string',
    password: 'string',
    details: 'string',
    others: 'string',
  },
};

export default class RealmManager {
  static _realmInstance = null;

  static getInstance() {
    if (
      this._realmInstance === null ||
      (this._realmInstance !== null && this._realmInstance.isClosed)
    ) {
      try {
        console.log('REISSUE INSTANCE');
        RealmManager.reIssueInstance();
      } catch (e) {
        console.error('DATABASE ERROR', e);
        return null;
      }
    }
    return this._realmInstance;
  }

  static reIssueInstance() {
    let commonData = CommonDataManager.getInstance();
    if (!commonData.getMasterKeyStatus()) {
      console.error('ATTEMPTED TO CALL DB FILE USING BLANK KEY');
    }
    this._realmInstance = new Realm({
      schema: [Credentials.schema],
      path: DATABASE_NAME,
      encryptionKey: convertStringToByteArray(commonData.getMasterKey()),
    });
  }

  static testInstance(key) {
    try {
      let a = new Realm({
        schema: [Credentials.schema],
        path: DATABASE_NAME,
        encryptionKey: convertStringToByteArray(key),
      });
      console.log(a);
      return a;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
