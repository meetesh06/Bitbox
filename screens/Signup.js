/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import {PRIMARY, WHITE, B_CONTAINER, B_HIGHLIGHT} from './Globals/Colors';

import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme, darkThemeColor} from './Globals/Functions';
import {USER_NAME, USER_EMAIL, USER_PHONE} from './Globals/AsyncStorageEnum';

import TopBar from './Components/TopBar';
import Input from './Components/Input';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  // const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  // const [phoneError, setphoneError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [loading, setLoading] = useState(false);
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
      RNSecureKeyStore.set(USER_PHONE, phone, {
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
    setLoading(true);
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
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'handled'}>
          <Input
            title="Name"
            icon="user"
            value={name}
            error={nameError}
            updater={(text) => {
              validateExpression(
                /^[A-Za-z\s]+$/,
                text.trim(),
                setName,
                setNameError,
              );
            }}
            style={{
              marginTop: 25,
            }}
          />
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

          <Input
            title="Phone"
            icon="phone"
            value={phone}
            keyboardType={'mobile'}
            error={phoneError}
            updater={(text) => {
              validateExpression(
                /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/g,
                text.trim(),
                setPhone,
                setPhoneError,
              );
            }}
          />

          <View style={styles.inputContainer}>
            <Text
              style={{...styles.otpText, color: darkThemeColor(B_HIGHLIGHT)}}>
              You don't have to worry, we wont not be sending you any spam or
              promotional content.{'\n'}
            </Text>
          </View>
          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  ...ignoreTheme(BUTTONS.BUTTON3, 'btn'),
                  borderColor:
                    loading ||
                    nameError ||
                    emailError ||
                    phoneError ||
                    name === '' ||
                    email === '' ||
                    phone === ''
                      ? '#bebebe'
                      : '#1e88ae',
                }}
                disabled={
                  loading ||
                  nameError ||
                  emailError ||
                  phoneError ||
                  name === '' ||
                  email === '' ||
                  phone === ''
                }
                onPress={handleSignup}>
                {!loading && (
                  <Text
                    style={{
                      ...ignoreTheme(BUTTONS.BUTTON3, 'text'),
                      color:
                        nameError ||
                        emailError ||
                        phoneError ||
                        name === '' ||
                        email === '' ||
                        phone === ''
                          ? '#bebebe'
                          : '#1e88ae',
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
    backgroundColor: WHITE,
  },
  scrollView: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  inputContainerFirst: {
    marginTop: 50,
    marginBottom: 5,
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
