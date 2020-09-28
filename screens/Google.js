/* eslint-disable handle-callback-err */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from 'react-native-navigation-hooks';

import THEME_DATA from './Globals/ThemeData';
import {
  darkTheme,
  callGoogleSignIn,
  refreshToken,
  updateRemoteStatus,
} from './Globals/Functions';

import {API_URL} from './Globals/AsyncStorageEnum';

import CommonDataManager from './Globals/CommonDataManager';

import {PRIMARY} from './Globals/Colors';

import {goToHome} from './Navigators/HomeNav';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const BUTTONS = THEME_DATA.BUTTONS;
  const commonData = CommonDataManager.getInstance();
  const [loading, setLoading] = useState(false);

  async function handleSignupWithoutGoogle() {
    setLoading(true);
    const params = {
      token: commonData.getApiToken(),
      status: false,
    };
    fetch(API_URL + '/remote-status-update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then(async (result) => {
        console.log(result);
        if (result.error === false) {
          await refreshToken(result.data.token);
          await updateRemoteStatus('false');
          goToHome(setStackRoot);
        } else {
          commonData.setRemote(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        commonData.setRemote(false);
        setLoading(false);
      });
  }

  async function googleSignIn() {
    setLoading(true);
    const {error, mssg} = await callGoogleSignIn();
    if (error === false) {
      const params = {
        token: commonData.getApiToken(),
        status: true,
      };
      fetch(API_URL + '/remote-status-update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then(async (result) => {
          if (result.error === false) {
            await refreshToken(result.data.token);
            await updateRemoteStatus('true');
            goToHome(setStackRoot);
          } else {
            commonData.setRemote(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          commonData.setRemote(false);
          setLoading(false);
        });
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
                style={darkTheme(BUTTONS.BUTTON4, 'btn')}
                onPress={googleSignIn}>
                <Text style={darkTheme(BUTTONS.BUTTON4, 'text')}>
                  {!loading && 'Sign In with Google'}
                  {loading && (
                    <ActivityIndicator
                      style={styles.loading}
                      size="large"
                      color={PRIMARY}
                    />
                  )}
                </Text>
              </TouchableOpacity>
              <Text style={styles.buttonSeperatorText}>OR</Text>
              <TouchableOpacity
                style={darkTheme(BUTTONS.BUTTON5, 'btn')}
                onPress={handleSignupWithoutGoogle}>
                <Text style={darkTheme(BUTTONS.BUTTON5, 'text')}>
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
