/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  // Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from 'react-native-navigation-hooks';

import {THEME_MODE} from './Globals/AsyncStorageEnum';
import THEME_DATA from './Globals/ThemeData';

import {goToHome} from './Navigators/HomeNav';

const App: () => React$Node = () => {
  const [theme, setTheme] = useState(THEME_DATA.C_THEME_MODE);
  const {setStackRoot} = useNavigation();

  async function saveTheme() {
    try {
      await AsyncStorage.setItem(THEME_MODE, theme);
      THEME_DATA.C_THEME_MODE = theme;
      goToHome(setStackRoot);
    } catch (error) {
      // Error saving data
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Theme</Text>
        </View>
        <View style={styles.themeSelectorHolder}>
          <TouchableOpacity
            onPress={() => setTheme('light')}
            style={{
              ...styles.themeSelectorIcon,
              borderBottomColor: theme === 'light' ? 'red' : undefined,
              borderBottomWidth: theme === 'light' ? 2 : undefined,
            }}
          />
          <TouchableOpacity
            onPress={() => setTheme('dark')}
            style={{
              ...styles.themeSelectorIcon,
              borderBottomColor: theme === 'dark' ? 'red' : undefined,
              borderBottomWidth: theme === 'dark' ? 2 : undefined,
            }}
          />
        </View>
        <View style={styles.submitContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button3} onPress={saveTheme}>
              <Text style={styles.button3Text}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    borderBottomColor: '#052a37',
    borderBottomWidth: 3,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
  },
  topBarText: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
  },
  scrollView: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  infoText1: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
  },
  themeSelectorIcon: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: '#f1f1f1',
  },
  themeSelectorHolder: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button3: {
    width: '70%',
    borderColor: '#1e88ae',
    borderWidth: 2.3,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  button3Text: {
    textAlign: 'center',
    color: '#1e88ae',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});

export default App;
