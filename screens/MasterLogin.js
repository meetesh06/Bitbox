/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import {
  darkThemeColor,
  darkTheme,
  generateKey,
  deleteDatabaseFile,
  storeDatabaseCreds,
} from './Globals/Functions';
import {goToHome} from './Navigators/HomeNav';
import {B_CONTAINER, B_HIGHLIGHT, PRIMARY} from './Globals/Colors';
import TopBar from './Components/TopBar';
import RealmManager from '../database/realm';

const App: () => React$Node = ({salt = '', newFile}) => {
  const {setStackRoot} = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [unlockError, setUnlockError] = useState('');
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

  // function storeDataAsync(masterKey, call) {
  //   Promise.all([
  //     RNSecureKeyStore.set(MASTER_KEY, masterKey, {
  //       accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  //     }),
  //     RNSecureKeyStore.set(SALT, '', {
  //       accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  //     }),
  //   ])
  //     .then((res) => {
  //       call();
  //     })
  //     .catch((err) => {
  //       console.log(err, 'THERE WAS AN ERROR ');
  //     });
  // }

  async function createNewDatabase() {
    await storeDatabaseCreds(password);
    await deleteDatabaseFile();
    RealmManager.reIssueInstance();
    goToHome(setStackRoot);
  }

  async function handleNext() {
    setLoading(true);
    // TRY REALM LOGIN
    if (newFile !== undefined && newFile === true) {
      return createNewDatabase();
    }
    let key = await generateKey(password, salt, 5000, 256);
    try {
      let a = RealmManager.testInstance(key);
      a.close();
      console.log('SUCCESSFUL KEY', key);
      await storeDatabaseCreds(password);
      RealmManager.reIssueInstance();
      goToHome(setStackRoot);
      setUnlockError('SUCCESSFULLY UNLOCKED');
    } catch (e) {
      console.error('ERROR UNLOCKING DATABASE', e);
      setUnlockError('ERROR UNLOCKING DATABASE');
      setPasswordError(true);
      setLoading(false);
    }
  }

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Enter Master Password" />
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
          <View>
            <Text
              style={{...styles.infoText1, color: darkThemeColor(B_HIGHLIGHT)}}>
              {newFile === undefined &&
                unlockError === '' &&
                'Please enter the master password to unlock your bitbox'}
              {newFile === undefined && unlockError !== '' && unlockError}
              {newFile !== undefined &&
                newFile === true &&
                'Create a master password for your bitbox file'}
            </Text>
          </View>
          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  ...darkTheme(BUTTONS.BUTTON4, 'btn'),
                  borderColor:
                    loading || passwordError || password === ''
                      ? '#bebebe'
                      : '#1e88ae',
                  backgroundColor:
                    loading || passwordError || password === ''
                      ? '#fff'
                      : '#1e88ae',
                }}
                disabled={loading || passwordError || password === ''}
                onPress={handleNext}>
                {!loading && (
                  <Text
                    style={{
                      ...darkTheme(BUTTONS.BUTTON4, 'text'),
                      color:
                        passwordError || password === '' ? '#bebebe' : '#fff',
                    }}>
                    {newFile === undefined && 'UNLOCK'}
                    {newFile !== undefined && newFile === true && 'CREATE'}
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
