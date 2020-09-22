import Realm from 'realm';
import {CREDENTIALS_SCHEMA} from '../screens/Globals/Database';
// import {generateKey} from '../screens/Globals/Functions';
import CommonDataManager from '../screens/Globals/CommonDataManager';
import {convertStringToByteArray} from '../screens/Globals/Functions';

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

// export default new Realm({
//   schema: [Credentials],
//   // encryptionKey: ENCRYPTION_KEY,
// });

export default class RealmManager {
  static _realmInstance = null;

  static getInstance() {
    if (RealmManager._realmInstance == null) {
      let commonData = CommonDataManager.getInstance();
      if (!commonData.getMasterKeyStatus()) {
        console.error('ATTEMPT CALL DB FILE USING BLANK KEY');
        return null;
      }
      RealmManager._realmInstance = new Realm({
        schema: [Credentials.schema],
        encryptionKey: convertStringToByteArray(commonData.getMasterKey()),
      });
    }
    return this._realmInstance;
  }
}
