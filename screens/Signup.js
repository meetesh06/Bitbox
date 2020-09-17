/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  // Dimensions,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Hideo} from 'react-native-textinput-effects';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from 'react-native-navigation-hooks';
import {goToHome} from './Navigators/HomeNav';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);
  const [otp, setOtp] = useState('');

  function validateExpression(expression, val, state, trigger) {
    if (!expression.test(val)) {
      trigger(true);
    } else {
      trigger(false);
    }
    state(val);
  }

  async function handleSignup() {
    goToHome(setStackRoot);
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Sign Up</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.inputContainerFirst}>
            <Hideo
              iconClass={FontAwesomeIcon}
              iconName={'user'}
              placeholder="Name"
              iconColor={'white'}
              iconBackgroundColor={'#1e88ae'}
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
              iconBackgroundColor={'#1e88ae'}
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
            <Text style={styles.otpText}>
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
                  ...styles.button3,
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
                    ...styles.button3Text,
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
