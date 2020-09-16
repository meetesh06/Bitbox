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
const App: () => React$Node = () => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  function validateExpression(expression, val, state, trigger) {
    if (!expression.test(val)) {
      trigger(true);
    } else {
      trigger(false);
    }
    state(val);
  }

  function handleSignup() {}
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
                  ...styles.button4,
                  borderColor:
                    passwordError || password === '' ? '#bebebe' : '#1e88ae',
                  backgroundColor:
                    passwordError || password === '' ? '#fff' : '#1e88ae',
                }}
                disabled={passwordError || password === ''}
                onPress={handleSignup}>
                <Text
                  style={{
                    ...styles.button4Text,
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
  button4: {
    width: '70%',
    borderColor: '#1e88ae',
    borderWidth: 2.3,
    padding: 15,
    backgroundColor: '#1e88ae',
    borderRadius: 10,
  },
  button4Text: {
    textAlign: 'center',
    color: '#fff',
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
    fontFamily: 'Poppins-Medium',
  },
  infoText1: {
    color: '#052a37',
    fontFamily: 'Poppins-Bold',
  },
});

export default App;
