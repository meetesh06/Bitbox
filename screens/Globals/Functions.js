/* eslint-disable handle-callback-err */
import THEME_DATA from './ThemeData';
import {
  THEME_MODE,
  USER_NAME,
  USER_EMAIL,
  USER_AGE,
  REMOTE_BACKUP,
} from './AsyncStorageEnum';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {MASTER_KEY, SALT} from './Database';
import CommonDataManager from './CommonDataManager';
import {GoogleSignin} from '@react-native-community/google-signin';
import RNFS from 'react-native-fs';
import {DATABASE_NAME} from './AsyncStorageEnum.js';
import {statusCodes} from '@react-native-community/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';

var Aes = NativeModules.Aes;

export const updateThemeMode = async () => {
  try {
    const value = await AsyncStorage.getItem(THEME_MODE);
    if (!value) {
      return;
    }
    THEME_DATA.C_THEME_MODE = value;
    THEME_DATA.UPDATED = true;
    return;
  } catch (error) {
    // Error saving data
  }
};

export const updateCommonData = (call) => {
  let commonData = CommonDataManager.getInstance();
  RNSecureKeyStore.get(USER_NAME).then(
    (name) => {
      RNSecureKeyStore.get(USER_EMAIL).then((email) => {
        RNSecureKeyStore.get(USER_AGE).then((age) => {
          commonData.setSignedIn(true);
          commonData.setUsername(name);
          commonData.setEmail(email);
          commonData.setAge(age);
          RNSecureKeyStore.get(REMOTE_BACKUP)
            .then(
              (remote) => {
                if (remote === 'true') {
                  GoogleSignin.configure({
                    scopes: ['https://www.googleapis.com/auth/drive.appdata'], // what API you want to access on behalf of the user, default is email and profile
                    webClientId:
                      '90184904422-urjbjla8slor0c0qh3e6nvir4htdn60h.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
                    // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                    // hostedDomain: '', // specifies a hosted domain restriction
                    // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
                    // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
                    // accountName: '', // [Android] specifies an account name on the device that should be used
                    // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
                  });
                }
                commonData.setRemote(remote === 'true');
              },
              (err) => {
                console.error('REMOTE PAGE NEVER LOADED');
                commonData.setRemote(false);
              },
            )
            .finally(() => {
              call(true);
            });
        });
      });
    },
    (err) => {
      // console.log('user not signed in');
      commonData.setSignedIn(false);
      call(false);
    },
  );
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

const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

export const updateDatabaseManager = (call) => {
  let commonData = CommonDataManager.getInstance();
  RNSecureKeyStore.get(MASTER_KEY).then(
    (res) => {
      RNSecureKeyStore.get(SALT).then(
        (salt) => {
          generateKey(res, salt, 5000, 256).then((key) => {
            commonData.setMasterKey(key);
            commonData.setMasterKeyStatus(true);
            commonData.setSaltStatus(salt === '' ? false : true);
            call(true);
          });
        },
        (errSalt) => {},
      );
    },
    (err) => {
      commonData.setMasterKeyStatus(false);
      console.error('MASTER KEY NOT SET');
      call(false);
    },
  );
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
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    console.log(tokens);
    commonData.setRemoteTokens(tokens);
    commonData.setRemoteUserData(userInfo);
    commonData.setGoogleSignedInSession(true);
    return {
      error: false,
      mssg: 'successfully logged in',
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        error: true,
        mssg: 'sign in cancelled',
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        error: true,
        mssg: 'login in progress',
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        error: true,
        mssg: 'google play services required',
      };
    } else {
      return {
        error: true,
        mssg: error.toString(),
      };
    }
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
            console.error('ERROR DELETING FILE ', resp);
          } else {
            console.log('SUCCESS DELETING FILE ', resp);
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
