/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const App: () => React$Node = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.appdata'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '90184904422-urjbjla8slor0c0qh3e6nvir4htdn60h.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  function handleSignup() {}
  async function googleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({userInfo});
      console.log(userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
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
              <TouchableOpacity style={styles.button4} onPress={googleSignIn}>
                <Text style={styles.button4Text}>Sign In with Google</Text>
              </TouchableOpacity>
              <Text style={styles.buttonSeperatorText}>OR</Text>
              <TouchableOpacity style={styles.button5} onPress={handleSignup}>
                <Text style={styles.button5Text}>Continue without google</Text>
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
  button5: {
    width: '70%',
    padding: 0,
    borderRadius: 10,
  },
  button5Text: {
    textAlign: 'center',
    color: '#a0a0a0',
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