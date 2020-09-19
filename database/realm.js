import Realm from 'realm';
import CREDENTIALS_SCHEMA from '../screens/Globals/Database';
// import {generateKey} from '../screens/Globals/Functions';
// import CommonDataManager from '../screens/Globals/CommonDataManager';
// import {convertStringToByteArray} from '../screens/Globals/Functions';

// let commonData = CommonDataManager.getInstance();

// const ENCRYPTION_KEY = convertStringToByteArray(commonData.getMasterKey());

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

export default new Realm({
  schema: [Credentials],
  // encryptionKey: ENCRYPTION_KEY,
});
