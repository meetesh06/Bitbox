import THEME_DATA from './ThemeData';

export const darkTheme = (obj, sel) => {
  if (THEME_DATA.C_THEME_MODE == 'light') {
    return obj[sel];
  } else {
    return obj['d_' + sel];
  }
};

export const ignoreTheme = (obj, sel) => {
  return obj[sel];
};
