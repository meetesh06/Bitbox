import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from 'react-native-navigation-hooks';

import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme, callGoogleSignIn} from './Globals/Functions';

import {REMOTE_BACKUP} from './Globals/AsyncStorageEnum';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import CommonDataManager from './Globals/CommonDataManager';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const BUTTONS = THEME_DATA.BUTTONS;
  const commonData = CommonDataManager.getInstance();
  async function handleSignup() {
    // SET CLOUD STORAGE TO NO
    await RNSecureKeyStore.set(REMOTE_BACKUP, 'false', {
      accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    commonData.setRemote(false);
    handleNextPage();
  }

  function handleNextPage(data) {
    setStackRoot({
      component: {
        name: 'com.mk1er.Theme',
        options: {
          topBar: {
            visible: false,
          },
          animations: {
            push: {
              content: {
                alpha: {
                  from: 0,
                  to: 1,
                  duration: 200,
                },
              },
            },
            pop: {
              content: {
                alpha: {
                  from: 1,
                  to: 0,
                  duration: 100,
                },
              },
            },
          },
        },
      },
    });
  }

  async function googleSignIn() {
    const {error, mssg} = await callGoogleSignIn();
    if (error === false) {
      handleNextPage();
    } else {
      console.log('SIGN IN FAILURE', mssg);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Remote Backup</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.inputContainerFirstGraphic}>
            <FontAwesomeIcon name="cloud" size={150} color="#1e88ae" />
          </View>
          <View>
            <Text style={styles.infoText2}>
              Phones and other devices get damaged all the time, we recommend
              you connect your google drive, so that we can backup your data
              periodically.
            </Text>
          </View>
          <View>
            <Text style={styles.infoText3}>
              Your Data is encrypted and cannot be read by anyone except you.
            </Text>
          </View>
          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={ignoreTheme(BUTTONS.BUTTON4, 'btn')}
                onPress={googleSignIn}>
                <Text style={ignoreTheme(BUTTONS.BUTTON4, 'text')}>
                  Sign In with Google
                </Text>
              </TouchableOpacity>
              <Text style={styles.buttonSeperatorText}>OR</Text>
              <TouchableOpacity
                style={ignoreTheme(BUTTONS.BUTTON5, 'btn')}
                onPress={handleSignup}>
                <Text style={ignoreTheme(BUTTONS.BUTTON5, 'text')}>
                  Continue without google
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainerFirstGraphic: {
    marginTop: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    color: '#464949',
    backgroundColor: '#f1f1f1',
    borderBottomColor: 'red',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  otpText: {
    color: '#052a37',
    fontFamily: 'Poppins-Medium',
  },
  infoText1: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
  },
  infoText2: {
    color: '#052a37',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  infoText3: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
  },
  buttonSeperatorText: {
    padding: 10,
    fontFamily: 'Poppins-Thin',
    color: '#052a37',
  },
});

export default App;
