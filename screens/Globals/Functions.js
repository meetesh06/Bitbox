/* eslint-disable handle-callback-err */
import THEME_DATA from './ThemeData';
import {
  THEME_MODE,
  USER_NAME,
  USER_EMAIL,
  USER_PHONE,
  REMOTE_BACKUP,
  TOKEN,
  REMOTE_BACKUP_STATUS,
} from './AsyncStorageEnum';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {MASTER_KEY, SALT} from './Database';
import CommonDataManager from './CommonDataManager';
import {GoogleSignin} from '@react-native-community/google-signin';
import RNFS from 'react-native-fs';
import {DATABASE_NAME} from './AsyncStorageEnum.js';
import {statusCodes} from '@react-native-community/google-signin';
import Realm from 'realm';

var Aes = NativeModules.Aes;

export const refreshToken = async (token) => {
  try {
    let commonData = CommonDataManager.getInstance();
    await RNSecureKeyStore.set(TOKEN, token, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    commonData.setApiToken(token);
    return true;
  } catch (e) {
    return true;
  }
};

export const updateRemoteStatus = async (status) => {
  try {
    let commonData = CommonDataManager.getInstance();
    await RNSecureKeyStore.set(REMOTE_BACKUP, status, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    commonData.setRemote(status === 'true');
    return true;
  } catch (e) {
    return true;
  }
};

export const storeCommonData = async (name, email, phone, token) => {
  try {
    let commonData = CommonDataManager.getInstance();
    await RNSecureKeyStore.set(USER_NAME, name, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    await RNSecureKeyStore.set(USER_EMAIL, email, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    await RNSecureKeyStore.set(USER_PHONE, phone, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    await RNSecureKeyStore.set(TOKEN, token, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    await RNSecureKeyStore.set(SALT, '', {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    commonData.setSignedIn(true);
    commonData.setUsername(name);
    commonData.setEmail(email);
    commonData.setPhone(phone);
    commonData.setApiToken(token);
  } catch (e) {
    console.error('ERROR SAVING COMMON DATA', e);
  }
};

export const deleteDatabaseFile = async () => {
  try {
    Realm.deleteFile({path: DATABASE_NAME});
  } catch (e) {}
};

export const deleteAllLocalData = async () => {
  try {
    await RNSecureKeyStore.remove(USER_NAME);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(USER_EMAIL);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(USER_PHONE);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(TOKEN);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(REMOTE_BACKUP);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(MASTER_KEY);
  } catch (e) {}
  try {
    await RNSecureKeyStore.remove(SALT);
  } catch (e) {}
};

export const initCommonData = async () => {
  // STATUS
  let commonData = CommonDataManager.getInstance();
  let status = {
    loggedIn: false,
    remotePageLoaded: false,
    themePageLoaded: false,
  };
  try {
    const name = await RNSecureKeyStore.get(USER_NAME);
    const email = await RNSecureKeyStore.get(USER_EMAIL);
    const phone = await RNSecureKeyStore.get(USER_PHONE);
    const token = await RNSecureKeyStore.get(TOKEN);
    commonData.setSignedIn(true);
    commonData.setUsername(name);
    commonData.setEmail(email);
    commonData.setPhone(phone);
    commonData.setApiToken(token);
    status.loggedIn = true;
  } catch (e) {
    console.error(e);
    commonData.setSignedIn(false);
  }
  if (commonData.getSignedIn()) {
    try {
      const remote = await RNSecureKeyStore.get(REMOTE_BACKUP);
      console.log('REMOTE', remote);
      if (remote === 'true') {
        GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive.appdata'],
          webClientId:
            '90184904422-urjbjla8slor0c0qh3e6nvir4htdn60h.apps.googleusercontent.com',
        });
      }
      commonData.setRemote(remote === 'true');
      status.remotePageLoaded = true;
    } catch (e) {
      console.error(e);
      commonData.setRemote(false);
    }
  }
  try {
    const value = await AsyncStorage.getItem(THEME_MODE);
    THEME_DATA.C_THEME_MODE = value;
    THEME_DATA.UPDATED = true;
    status.themePageLoaded = true;
  } catch (e) {
    console.error(e);
  }
  return status;
};

export const darkTheme = (obj, sel) => {
  if (THEME_DATA.C_THEME_MODE === 'light') {
    return obj[sel];
  } else {
    return obj['d_' + sel];
  }
};

export const darkThemeColor = (color) => {
  if (THEME_DATA.C_THEME_MODE === 'light') {
    return color.light;
  } else {
    return color.dark;
  }
};

export const ignoreTheme = (obj, sel) => {
  return obj[sel];
};

export const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

export const storeDatabaseCreds = async (mKey, salt = '') => {
  try {
    let commonData = CommonDataManager.getInstance();
    await RNSecureKeyStore.set(MASTER_KEY, mKey, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    await RNSecureKeyStore.set(SALT, salt, {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    const key = await generateKey(mKey, salt, 5000, 256);
    commonData.setMasterKey(key);
    commonData.setMasterKeyStatus(true);
    commonData.setSaltStatus(salt === '' ? false : true);
  } catch (e) {
    console.error('ERROR SAVING COMMON DATA', e);
  }
};

export const initDatabaseKey = async () => {
  let commonData = CommonDataManager.getInstance();
  let status = {
    isMasterKeySet: false,
  };
  try {
    const mKey = await RNSecureKeyStore.get(MASTER_KEY);
    const salt = await RNSecureKeyStore.get(SALT);
    const key = await generateKey(mKey, salt, 5000, 256);
    commonData.setMasterKey(key);
    commonData.setMasterKeyStatus(true);
    commonData.setSaltStatus(salt === '' ? false : true);
    status.isMasterKeySet = true;
  } catch (e) {
    console.error('MASTER KEY NOT SET', e);
  }
  return status;
};

export const convertStringToByteArray = (str) => {
  let array = new Int8Array(str.length);
  let i = 0;
  for (i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array;
};

export async function callGoogleSignIn() {
  const commonData = CommonDataManager.getInstance();
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
    webClientId:
      '90184904422-urjbjla8slor0c0qh3e6nvir4htdn60h.apps.googleusercontent.com',
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    await RNSecureKeyStore.set(REMOTE_BACKUP, 'true', {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    commonData.setRemote(true);
    commonData.setRemoteUserData(userInfo);
    return {error: false, mssg: 'SIGN IN SUCCESSFUL'};
  } catch (error) {
    console.log(error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
    return {error: true, mssg: 'SIGN IN FAILURE'};
  }
}

function deleteFile(id, auth, call) {
  fetch('https://www.googleapis.com/drive/v3/files/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: auth,
    },
  })
    .then((val) => call(false, val))
    .catch((err) => call(true, err));
}

export function performMultipartUpload(id, params, progress, call) {
  let http = new XMLHttpRequest();
  let url =
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  http.addEventListener('progress', progress);
  http.onreadystatechange = function () {
    if (http.readyState === XMLHttpRequest.DONE) {
      let responseJson = JSON.parse(http.responseText);
      if (id !== null) {
        deleteFile(id, params.headers.Authorization, (err, resp) => {
          if (err) {
            // console.error('ERROR DELETING FILE ', resp);
          } else {
            console.log('SUCCESS DELETING FILE ');
          }
          call(responseJson);
        });
      } else {
        call(responseJson);
      }
    }
  };
  http.open('POST', url, true);
  http.setRequestHeader('Authorization', params.headers.Authorization);
  http.setRequestHeader('Content-Type', params.headers['Content-Type']);
  http.setRequestHeader('Content-Length', params.headers['Content-Length']);
  http.send(params.body);
}

function createFileMultipart(media, mediaType, metadata, isBase64, token) {
  const boundary = 'foo_bar_baz';
  const ddb = `--${boundary}`;
  const ending = `\n${ddb}--`;

  let body =
    `\n${ddb}\n` +
    'Content-Type: application/json; charset=UTF-8\n\n' +
    `${JSON.stringify(metadata)}\n\n${ddb}\n` +
    (isBase64 ? 'Content-Transfer-Encoding: base64\n' : '') +
    `Content-Type: ${mediaType}\n\n`;

  body += `${media}${ending}`;
  return {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/related; boundary=foo_bar_baz',
      'Content-Length': body.length,
    },
    body,
  };
}

export async function createRequest(token) {
  const databaseBinary = await RNFS.readFile(
    RNFS.DocumentDirectoryPath + '/' + DATABASE_NAME,
    'base64',
  );

  let result = createFileMultipart(
    databaseBinary,
    'application/octet-stream',
    {
      parents: ['appDataFolder'],
      name: DATABASE_NAME,
    },
    true,
    token,
  );

  return result;
}

export function downloadDatabaseFile(id, token, begin, progress) {
  return RNFS.downloadFile({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fromUrl: `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    toFile: RNFS.DocumentDirectoryPath + '/' + DATABASE_NAME,
    begin,
    progress,
    background: true,
    progressDivider: 1,
  }).promise;
}

export function getDatabaseFileList(token) {
  return fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = '${DATABASE_NAME}'&fields=files/id, files/modifiedTime&orderBy=modifiedTime desc`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
