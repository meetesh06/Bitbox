import THEME_DATA from './ThemeData';
import {THEME_MODE} from './AsyncStorageEnum';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeModules} from 'react-native';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {MASTER_KEY, SALT} from './Database';
import CommonDataManager from './CommonDataManager';

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

export const darkTheme = (obj, sel) => {
  // if (THEME_DATA.UPDATED === false) {
  //   await updateThemeMode();
  // }
  if (THEME_DATA.C_THEME_MODE === 'light') {
    return obj[sel];
  } else {
    return obj['d_' + sel];
  }
};

export const darkThemeColor = (color) => {
  // if (THEME_DATA.UPDATED === false) {
  //   await updateThemeMode();
  // }
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

export const updateDatabaseManager = async () => {
  RNSecureKeyStore.get(MASTER_KEY).then(
    (res) => {
      RNSecureKeyStore.get(SALT).then(
        (salt) => {
          generateKey(res, salt, 5000, 256).then((key) => {
            let commonData = CommonDataManager.getInstance();
            commonData.setMasterKey(key);
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

export const convertStringToByteArray = (str) => {
  String.prototype.encodeHex = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };

  var byteArray = str.encodeHex();
  return byteArray;
};
