import THEME_DATA from './ThemeData';
import {THEME_MODE, USER_NAME, USER_EMAIL, USER_AGE} from './AsyncStorageEnum';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {MASTER_KEY, SALT} from './Database';
import CommonDataManager from './CommonDataManager';
import { GoogleSignin } from '@react-native-community/google-signin';

var Aes = NativeModules.Aes;

export const updateThemeMode = async () => {
  try {
    const value = await AsyncStorage.getItem(THEME_MODE);
    THEME_DATA.C_THEME_MODE = value;
    THEME_DATA.UPDATED = true;
    return;
  } catch (error) {
    // Error saving data
  }
};

export const updateCommonData = (call) => {
  RNSecureKeyStore.get(USER_NAME).then((name) => {
    RNSecureKeyStore.get(USER_EMAIL).then((email) => {
      RNSecureKeyStore.get(USER_AGE).then((age) => {
        GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive.appdata'], // what API you want to access on behalf of the user, default is email and profile
          webClientId:
            '90184904422-urjbjla8slor0c0qh3e6nvir4htdn60h.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
          // hostedDomain: '', // specifies a hosted domain restriction
          // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
          forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
          // accountName: '', // [Android] specifies an account name on the device that should be used
          // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
        let commonData = CommonDataManager.getInstance();
        commonData.setUsername(name);
        commonData.setEmail(email);
        commonData.setAge(age);
        call();
      });
    });
  });
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
  RNSecureKeyStore.get(MASTER_KEY).then(
    (res) => {
      RNSecureKeyStore.get(SALT).then(
        (salt) => {
          generateKey(res, salt, 5000, 256).then((key) => {
            let commonData = CommonDataManager.getInstance();
            commonData.setMasterKey(key);
            commonData.setSaltStatus(salt === '' ? false : true);
            call();
          });
        },
        (errSalt) => {},
      );
    },
    (err) => {
      console.log(err);
    },
  );
};

export const convertStringToByteArray = (s) => {
  let final = new Int8Array(64);
  final = Int8Array.from(s);
  return final;
};
