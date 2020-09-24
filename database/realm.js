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
    if (RealmManager._realmInstance === null || !this._realmInstance.isClosed) {
      RealmManager.reIssueInstance();
    }
    return this._realmInstance;
  }

  static reIssueInstance() {
    let commonData = CommonDataManager.getInstance();
    if (!commonData.getMasterKeyStatus()) {
      console.error('ATTEMPTED TO CALL DB FILE USING BLANK KEY');
    }
    RealmManager._realmInstance = new Realm({
      schema: [Credentials.schema],
      path: DATABASE_NAME,
      encryptionKey: convertStringToByteArray(commonData.getMasterKey()),
    });
  }
}
