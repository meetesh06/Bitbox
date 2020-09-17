import THEME_DATA from './ThemeData';
import {THEME_MODE} from './AsyncStorageEnum';
import AsyncStorage from '@react-native-community/async-storage';

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
