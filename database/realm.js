import Realm from 'realm';
import CREDENTIALS_SCHEMA from '../screens/Globals/Database';
import ENCRYPTION_KEY from '../screens/Globals/Database';

class Credentials extends Realm.Object {}

Credentials.schema = {
  name: CREDENTIALS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
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
  encryptionKey: ENCRYPTION_KEY,
});
