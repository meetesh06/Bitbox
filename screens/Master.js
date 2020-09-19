/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  CheckBox,
  // Dimensions,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Hideo} from 'react-native-textinput-effects';
import {useNavigation} from 'react-native-navigation-hooks';
import {PRIMARY} from './Globals/Colors';
import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme} from './Globals/Functions';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

import {MASTER_KEY, SALT} from './Globals/Database';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [remote, setRemote] = useState('');
  const [remoteLocking, setRemoteLocking] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
        name: 'com.mk1er.Google',
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

  useEffect(() => {
    // CALL TO REMOTE SERVER
    setRemote('REMOTE_SALT');
  }, []);

  function handleNext() {
    console.log(remoteLocking ? remote : salt);
    Promise.all([
      RNSecureKeyStore.set(MASTER_KEY, password, {
        accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      }),
      RNSecureKeyStore.set(SALT, remoteLocking ? remote : salt, {
        accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      }),
    ])
      .then((res) => {
        console.log(res);
        nextScreen();
      })
      .catch((err) => {
        console.log(err, 'THERE WAS AN ERROR ');
      });
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Master Password</Text>
        </View>
        <ScrollView style={styles.scrollView}>
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
              secureTextEntry={true}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.otpText}>
              <FontAwesomeIcon name="chevron-right" size={10} color="#052a37" />{' '}
              Password must be atleast 8 characters {'\n'}
              <FontAwesomeIcon
                name="chevron-right"
                size={10}
                color="#052a37"
              />{' '}
              must contain at least 1 uppercase letter, 1 lowercase letter, and
              1 number {'\n'}
              <FontAwesomeIcon
                name="chevron-right"
                size={10}
                color="#052a37"
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
              value={remoteLocking}
              onValueChange={(val) => setRemoteLocking(val)}
            />
            <Text style={styles.checkboxText}>Enable Remote Locking.</Text>
          </View>
          <View>
            <Text style={styles.infoText1}>
              Your master password will be used to encrypt all your data. It is
              a good idea to write it down somewhere safe.
            </Text>
          </View>
          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  ...ignoreTheme(BUTTONS.BUTTON4, 'btn'),
                  borderColor:
                    passwordError || password === '' ? '#bebebe' : '#1e88ae',
                  backgroundColor:
                    passwordError || password === '' ? '#fff' : '#1e88ae',
                }}
                disabled={passwordError || password === ''}
                onPress={handleNext}>
                <Text
                  style={{
                    ...ignoreTheme(BUTTONS.BUTTON4, 'text'),
                    color:
                      passwordError || password === '' ? '#bebebe' : '#fff',
                  }}>
                  Continue
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
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
  },
  infoText1: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
  },
});

export default App;
