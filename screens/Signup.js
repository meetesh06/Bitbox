/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Hideo} from 'react-native-textinput-effects';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from 'react-native-navigation-hooks';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import {PRIMARY, WHITE, B_CONTAINER, B_HIGHLIGHT} from './Globals/Colors';

import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme, darkThemeColor} from './Globals/Functions';
import {USER_NAME, USER_EMAIL, USER_AGE} from './Globals/AsyncStorageEnum';

import TopBar from './Components/TopBar';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);
  const [otp, setOtp] = useState('');
  const BUTTONS = THEME_DATA.BUTTONS;

  function validateExpression(expression, val, state, trigger) {
    if (!expression.test(val)) {
      trigger(true);
    } else {
      trigger(false);
    }
    state(val);
  }

  function handleNext() {
    setStackRoot({
      component: {
        name: 'com.mk1er.Master',
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

  function storeDataAsync(call) {
    Promise.all([
      RNSecureKeyStore.set(USER_NAME, name, {
        accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      }),
      RNSecureKeyStore.set(USER_EMAIL, email, {
        accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      }),
      RNSecureKeyStore.set(USER_AGE, age, {
        accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      }),
    ])
      .then((res) => {
        call();
      })
      .catch((err) => {
        console.log(err, 'THERE WAS AN ERROR ');
      });
  }

  function handleSignup() {
    // MAKE SERVER CALL AND VERIFY OTP, IF ALL CHECKS OUT DO THIS
    storeDataAsync(() => {
      handleNext();
    });
  }
  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Sign Up" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.inputContainerFirst}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'user'}
              placeholder="Name"
              iconColor={'white'}
              iconBackgroundColor={PRIMARY}
              inputStyle={{
                ...styles.inputStyle,
                borderBottomWidth: nameError ? 2 : 0,
              }}
              value={name}
              onChangeText={(text) =>
                validateExpression(/^[A-Za-z\s]+$/, text, setName, setNameError)
              }
              keyboardType={'default'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'envelope'}
              placeholder="Email"
              iconColor={'white'}
              iconBackgroundColor={PRIMARY}
              inputStyle={{
                ...styles.inputStyle,
                borderBottomWidth: emailError ? 2 : 0,
              }}
              value={email}
              onChangeText={(text) =>
                validateExpression(
                  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  text,
                  setEmail,
                  setEmailError,
                )
              }
              keyboardType={'email-address'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'heart'}
              placeholder="Age"
              iconColor={'white'}
              iconBackgroundColor={'pink'}
              inputStyle={{
                ...styles.inputStyle,
                borderBottomWidth: ageError ? 2 : 0,
              }}
              value={age}
              onChangeText={(text) =>
                validateExpression(/[0-9]/g, text, setAge, setAgeError)
              }
              keyboardType={'phone-pad'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{...styles.otpText, color: darkThemeColor(B_HIGHLIGHT)}}>
              An OTP will be sent to your email address, please enter the code
              to continue
            </Text>
            <OTPTextInput
              tintColor="#1e88ae"
              handleTextChange={(text) => setOtp(text)}
            />
          </View>
          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  ...ignoreTheme(BUTTONS.BUTTON3, 'btn'),
                  borderColor:
                    nameError ||
                    emailError ||
                    ageError ||
                    name === '' ||
                    email === '' ||
                    age === ''
                      ? '#bebebe'
                      : '#1e88ae',
                }}
                disabled={
                  nameError ||
                  emailError ||
                  ageError ||
                  name === '' ||
                  email === '' ||
                  age === ''
                }
                onPress={handleSignup}>
                <Text
                  style={{
                    ...ignoreTheme(BUTTONS.BUTTON3, 'text'),
                    color:
                      nameError ||
                      emailError ||
                      ageError ||
                      name === '' ||
                      email === '' ||
                      age === ''
                        ? '#bebebe'
                        : '#1e88ae',
                  }}>
                  Send OTP
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
    backgroundColor: WHITE,
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
  },
});

export default App;
