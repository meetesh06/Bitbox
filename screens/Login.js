/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';

import {B_CONTAINER, PRIMARY, B_HIGHLIGHT} from './Globals/Colors';

import THEME_DATA from './Globals/ThemeData';
import {
  darkThemeColor,
  darkTheme,
  storeCommonData,
  deleteDatabaseFile,
} from './Globals/Functions';
import Input from './Components/Input';

import TopBar from './Components/TopBar';
import OTPTextInput from 'react-native-otp-textinput';
import {API_URL} from './Globals/AsyncStorageEnum';
import DeviceInfo from 'react-native-device-info';

const App: () => React$Node = () => {
  const {setStackRoot, pop} = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(true);
  const [otpCheckToken, setOtpCheckToken] = useState('');
  const [OTPSent, setOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const BUTTONS = THEME_DATA.BUTTONS;
  const ANIMATIONS = THEME_DATA.ANIMATIONS;

  const [loginError, setLoginError] = useState(false);

  function validateExpression(expression, val, state, trigger) {
    if (!expression.test(val)) {
      trigger(true);
    } else {
      trigger(false);
    }
    state(val);
  }

  async function handleSendOTP() {
    setLoading(true);
    let uniqueId = DeviceInfo.getUniqueId();
    let systemVersion = DeviceInfo.getSystemVersion();
    let systemName = DeviceInfo.getSystemName();
    let hasNotch = DeviceInfo.hasNotch();
    let type = DeviceInfo.getDeviceType();
    let deviceId = DeviceInfo.getDeviceId();

    let params = {
      email,
      deviceInfo: {
        systemVersion,
        systemName,
        hasNotch,
        type,
        deviceId,
      },
      deviceUUID: uniqueId,
    };
    fetch(API_URL + '/login-otp', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.error === false) {
          // SAVE TOKEN TO LOCAL STORAGE
          // CALL NEXT SCREEN
          setLoading(false);
          setOtpCheckToken(result.data.token);
          setOTPSent(true);
        } else {
          console.error('SIGNUP ERROR: ', result.mssg);
          setLoading(false);
          setOTPSent(false);
          setLoginError(result.mssg);
        }
      })
      .catch((err) => {
        setLoginError('UNKNOWN ERROR OCCURED 8001');
        setLoading(false);
        setOTPSent(false);
        console.error('SIGNUP ERROR: ', err);
      });
  }

  async function handleOTPCheck() {
    setLoading(true);
    setLoginError('');
    let params = {
      token: otpCheckToken,
      key: otp,
    };
    fetch(API_URL + '/login-check', {
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
          // CALL NEXT SCREEN
          await storeCommonData(
            result.data.name,
            result.data.email,
            result.data.phone,
            result.data.token,
          );
          await deleteDatabaseFile();
          if (result.data.remoteBackup) {
            console.log('USER HAS REMOTE BACKUP ON');
            setStackRoot({
              component: {
                name: 'com.mk1er.RestoreGoogleBackup',
                options: {
                  topBar: {
                    visible: false,
                  },
                  animations: ANIMATIONS.PP,
                },
              },
            });
            // GO TO DOWNLOAD BACKUP AND CONTINUE
          } else {
            console.log('NO REMOTE BACKUP, ASK TO ENABLE');
            // GO TO HOME PAGE
            setStackRoot({
              component: {
                name: 'com.mk1er.MasterLogin',
                options: {
                  topBar: {
                    visible: false,
                  },
                  animations: ANIMATIONS.PP,
                },
                passProps: {
                  newFile: true,
                },
              },
            });
          }
        } else {
          console.error('SIGNUP ERROR: ', result.mssg);
          setLoading(false);
          setLoginError(result.mssg);
        }
      })
      .catch((err) => {
        setLoginError('UNKNOWN ERROR OCCURED 8001');
        console.error('SIGNUP ERROR: ', err);
        setLoading(false);
      });
  }

  function updateOTP(text) {
    setOtp(text);
    if (text.length !== 6) {
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
        <TopBar title="Login" backCallback={() => pop()} />
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'handled'}>
          {!OTPSent && (
            <Input
              title="Email"
              icon="envelope"
              value={email}
              keyboardType={'email-address'}
              error={emailError}
              updater={(text) => {
                validateExpression(
                  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  text.trim(),
                  setEmail,
                  setEmailError,
                );
              }}
            />
          )}
          {!OTPSent && (
            <View style={styles.buttonContainer}>
              {!loading && loginError !== '' && (
                <Text
                  style={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 10,
                    textAlign: 'center',
                    color: 'red',
                    marginBottom: 10,
                  }}>
                  {loginError}
                </Text>
              )}
              <TouchableOpacity
                style={{
                  ...darkTheme(BUTTONS.BUTTON4, 'btn'),
                  borderColor:
                    emailError || email === '' || loading
                      ? '#bebebe'
                      : '#1e88ae',
                  backgroundColor:
                    emailError || email === '' || loading ? '#fff' : '#1e88ae',
                }}
                disabled={email === '' || emailError || loading}
                onPress={handleSendOTP}>
                {!loading && (
                  <Text
                    style={{
                      ...darkTheme(BUTTONS.BUTTON4, 'text'),
                      color:
                        email === '' || emailError || loading
                          ? '#bebebe'
                          : '#fff',
                    }}>
                    LOGIN
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
          )}
          {OTPSent && (
            <View>
              <Text
                style={{
                  color: darkThemeColor(B_HIGHLIGHT),
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                An email containing the otp was sent to {email}
              </Text>
              <OTPTextInput
                textInputStyle={{
                  color: darkThemeColor(B_HIGHLIGHT),
                  fontSize: 20,
                  width: '11%',
                }}
                containerStyle={{}}
                handleTextChange={updateOTP}
                inputCount={6}
              />
              <View style={styles.buttonContainer}>
                {!loading && loginError !== '' && (
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 10,
                      textAlign: 'center',
                      color: 'red',
                    }}>
                    {loginError}
                  </Text>
                )}
                <TouchableOpacity
                  style={{
                    ...darkTheme(BUTTONS.BUTTON4, 'btn'),
                    borderColor:
                      loading || otpError || otp === '' ? '#bebebe' : '#1e88ae',
                    backgroundColor:
                      loading || otpError || otp === '' ? '#fff' : '#1e88ae',
                  }}
                  disabled={otpError || loading === ''}
                  onPress={handleOTPCheck}>
                  {!loading && (
                    <Text
                      style={{
                        ...darkTheme(BUTTONS.BUTTON4, 'text'),
                        color:
                          loading || otpError || otp === ''
                            ? '#bebebe'
                            : '#fff',
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
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
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
    paddingTop: 30,
  },
});

export default App;
