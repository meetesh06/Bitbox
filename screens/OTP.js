/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';

import {B_CONTAINER, PRIMARY, B_HIGHLIGHT} from './Globals/Colors';
import {DATABASE_NAME} from './Globals/AsyncStorageEnum.js';

import THEME_DATA from './Globals/ThemeData';
import {
  darkThemeColor,
  darkTheme,
  storeCommonData,
  deleteDatabaseFile,
  storeDatabaseCreds,
} from './Globals/Functions';

import TopBar from './Components/TopBar';
import OTPTextInput from 'react-native-otp-textinput';
import {API_URL} from './Globals/AsyncStorageEnum';

import Realm from 'realm';

const App: () => React$Node = ({otpToken, name, email, phone, password}) => {
  const {setStackRoot} = useNavigation();
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const BUTTONS = THEME_DATA.BUTTONS;
  const ANIMATIONS = THEME_DATA.ANIMATIONS;

  const [creationError, setCreationError] = useState(false);

  async function handleNext() {
    setLoading(true);
    let params = {
      // eslint-disable-next-line radix
      key: parseInt(otp),
      token: otpToken,
    };
    fetch(API_URL + '/complete-user-verification', {
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
          // SAVE TOKEN TO LOCAL STORAGE
          let token = result.data.token;
          await storeCommonData(name, email, phone, token);
          await storeDatabaseCreds(password);
          await deleteDatabaseFile();
          nextScreen();
        } else {
          console.error('SIGNUP ERROR: ', result.mssg);
          setLoading(false);
          setCreationError(result.mssg);
        }
      })
      .catch((err) => {
        setCreationError('UNKNOWN ERROR OCCURED 8001');
        console.error('SIGNUP ERROR: ', err);
      });
  }

  function nextScreen() {
    setStackRoot({
      component: {
        name: 'com.mk1er.Google',
        options: {
          topBar: {
            visible: false,
          },
          animations: ANIMATIONS.PP,
        },
        passProps: {
          otpToken,
          email,
        },
      },
    });
  }

  function updateOTP(text) {
    setOtp(text);
    if (isNaN(text)) {
      setOtpError(true);
    } else {
      setOtpError(false);
    }
  }

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Verify OTP" />
        <View style={styles.scrollView}>
          <Text
            style={{
              ...styles.otpText,
              color: darkThemeColor(B_HIGHLIGHT),
            }}>
            An email containing the OTP was sent to {email}
          </Text>
          <OTPTextInput
            textInputStyle={{color: darkThemeColor(B_HIGHLIGHT)}}
            handleTextChange={updateOTP}
          />
          <View style={styles.buttonContainer}>
            {!loading && creationError !== '' && (
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 10,
                  textAlign: 'center',
                  color: 'red',
                }}>
                {creationError}
              </Text>
            )}
            <TouchableOpacity
              style={{
                ...darkTheme(BUTTONS.BUTTON4, 'btn'),
                borderColor: otpError || loading === '' ? '#bebebe' : '#1e88ae',
                backgroundColor:
                  otpError || loading === '' ? '#fff' : '#1e88ae',
              }}
              disabled={otpError || loading === ''}
              onPress={handleNext}>
              {!loading && (
                <Text
                  style={{
                    ...darkTheme(BUTTONS.BUTTON4, 'text'),
                    color: otpError || loading === '' ? '#bebebe' : '#fff',
                  }}>
                  VERIFY OTP
                </Text>
              )}
              {loading && (
                <ActivityIndicator
                  style={styles.loading}
                  size="large"
                  color={PRIMARY}
                />
              )}
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
  },
  scrollView: {
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  otpText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
});

export default App;
