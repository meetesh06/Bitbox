/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  // Dimensions,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Hideo} from 'react-native-textinput-effects';
import {useNavigation} from 'react-native-navigation-hooks';
import THEME_DATA from './Globals/ThemeData';
import {darkThemeColor, darkTheme} from './Globals/Functions';

import {B_CONTAINER, B_HIGHLIGHT, PRIMARY} from './Globals/Colors';

import CheckBox from '@react-native-community/checkbox';

import TopBar from './Components/TopBar';

import DeviceInfo from 'react-native-device-info';

import {API_URL} from './Globals/AsyncStorageEnum';

const App: () => React$Node = ({salt = '', name, email, phone}) => {
  const {setStackRoot, pop} = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creationError, setCreationError] = useState(false);
  let otpToken = '';

  const BUTTONS = THEME_DATA.BUTTONS;

  function validateExpression(expression, val, state, trigger) {
    if (!expression.test(val)) {
      trigger(true);
    } else {
      trigger(false);
    }
    state(val);
  }

  function nextScreen() {
    setStackRoot({
      component: {
        name: 'com.mk1er.OTP',
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
        passProps: {
          otpToken,
          name,
          email,
          phone,
          password,
        },
      },
    });
  }

  async function handleNext() {
    setLoading(true);
    let uniqueId = DeviceInfo.getUniqueId();
    let systemVersion = DeviceInfo.getSystemVersion();
    let systemName = DeviceInfo.getSystemName();
    let hasNotch = DeviceInfo.hasNotch();
    let type = DeviceInfo.getDeviceType();
    let deviceId = DeviceInfo.getDeviceId();
    let params = {
      username: name,
      email,
      phone,
      deviceInfo: {
        systemVersion,
        systemName,
        hasNotch,
        type,
        deviceId,
      },
      deviceUUID: uniqueId,
      master: password,
    };

    console.log(JSON.stringify(params));
    fetch(API_URL + '/new-user-registration', {
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
          otpToken = result.data.token;
          nextScreen();
        } else {
          console.error('SIGNUP ERROR: ', result.mssg);
          setLoading(false);
          setCreationError(result.mssg);
        }
      })
      .catch((err) => {
        setLoading(false);
        setCreationError('UNKNOWN ERROR OCCURED 7001');
        console.error('SIGNUP ERROR: ', err);
      });
  }

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Sign Up" backCallback={() => pop()} />
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.inputContainerFirst}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'lock'}
              placeholder="Password"
              iconColor={'white'}
              iconBackgroundColor={'#ffa61a'}
              inputStyle={{
                ...styles.inputStyle,
                borderBottomWidth: passwordError ? 2 : 0,
              }}
              value={password}
              onChangeText={(text) =>
                validateExpression(
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                  text,
                  setPassword,
                  setPasswordError,
                )
              }
              keyboardType={'default'}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{...styles.otpText, color: darkThemeColor(B_HIGHLIGHT)}}>
              <FontAwesomeIcon
                name="chevron-right"
                size={10}
                color={darkThemeColor(B_HIGHLIGHT)}
              />{' '}
              Password must be atleast 8 characters {'\n'}
              <FontAwesomeIcon
                name="chevron-right"
                size={10}
                color={darkThemeColor(B_HIGHLIGHT)}
              />{' '}
              must contain at least 1 uppercase letter, 1 lowercase letter, and
              1 number {'\n'}
              <FontAwesomeIcon
                name="chevron-right"
                size={10}
                color={darkThemeColor(B_HIGHLIGHT)}
              />{' '}
              Can contain special characters {'\n'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <CheckBox
              tintColors={{
                true: darkThemeColor(B_HIGHLIGHT),
                false: darkThemeColor(B_HIGHLIGHT),
              }}
              disabled={true}
              value={false}
            />
            <Text
              style={{
                ...styles.checkboxText,
                color: darkThemeColor(B_HIGHLIGHT),
              }}>
              Enable Remote Locking. (Under Dev Testing)
            </Text>
          </View>
          <View>
            <Text
              style={{...styles.infoText1, color: darkThemeColor(B_HIGHLIGHT)}}>
              Your master password will be used to encrypt all your data. It is
              a good idea to write it down somewhere safe.
            </Text>
          </View>
          <View style={styles.submitContainer}>
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
                  borderColor:
                    passwordError || password === '' ? '#bebebe' : '#1e88ae',
                  backgroundColor:
                    passwordError || password === '' ? '#fff' : '#1e88ae',
                }}
                disabled={passwordError || password === ''}
                onPress={handleNext}>
                {!loading && (
                  <Text
                    style={{
                      ...darkTheme(BUTTONS.BUTTON4, 'text'),
                      color:
                        passwordError || password === '' ? '#bebebe' : '#fff',
                    }}>
                    Continue
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
  inputContainerFirst: {
    marginTop: 50,
    marginBottom: 10,
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
  checkboxText: {
    color: '#052a37',
    fontSize: 13,
    paddingTop: 7,
    fontFamily: 'Poppins-Bold',
  },
  infoText1: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
  },
});

export default App;
