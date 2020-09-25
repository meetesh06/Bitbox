import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CommonDataManager from '../Globals/CommonDataManager';

import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import {WHITE} from '../Globals/Colors';

const gradientStyles = {
  cloud: ['#3977de', '#0a5e93'],
};

const App: () => React$Node = ({
  usesCloud,
  callUpdate,
  lastBackup,
  loading,
  cloudHistory,
  signInCallback,
  uploadProgress,
}) => {
  const commonData = CommonDataManager.getInstance();
  const animation = useRef(null);
  return (
    <LinearGradient colors={gradientStyles.cloud} style={styles.container}>
      {loading && (
        <ActivityIndicator style={styles.loading} size="large" color="#fff" />
      )}
      {loading === false &&
        usesCloud === true &&
        commonData.getGoogleSignedInSession() && (
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{
                uri: commonData.getRemoteUserData().user.photo,
              }}
            />
          </View>
        )}
      {!loading && (
        <View style={styles.mainHeadingContainer}>
          <Text style={styles.mainHeading}>
            {loading === false && usesCloud === true && 'Ready to Sync'}
          </Text>
          {loading === false && usesCloud === false && (
            <TouchableOpacity onPress={signInCallback}>
              <Text style={styles.mainHeadingNotSignedIn}>
                Sign in to google drive
              </Text>
              <Text style={styles.subHeadingNotSignedIn}>
                Your data will be backed up to your google drive folder
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.subHeading}>
            {loading === false &&
              usesCloud === true &&
              cloudHistory.length > 0 &&
              'Last Updated: ' +
                moment(cloudHistory[0].modifiedTime).format('YYYY-MM-DD HH:mm')}
            {loading === false &&
              usesCloud === true &&
              cloudHistory.length === 0 &&
              'Not Backed Up'}
          </Text>
        </View>
      )}
      {!loading && usesCloud === true && (
        <TouchableOpacity
          onPress={() => {
            callUpdate(animation);
          }}
          style={styles.updateBtnContainer}>
          <LottieView
            source={require('../../animations/lf30_editor_09islqra.json')}
            style={styles.lottieView}
            loop
            ref={animation}
          />
          <Text style={styles.progress}>{uploadProgress}</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  mainHeadingContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  mainHeading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#fff',
  },
  subHeading: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#fff',
  },
  mainHeadingNotSignedIn: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    top: -10,
  },
  subHeadingNotSignedIn: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    top: -10,
  },
  updateBtnContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: WHITE,
    borderWidth: 1,
    borderRadius: 10,
  },
  lottieView: {
    width: 80,
    height: 80,
  },
  progress: {
    position: 'absolute',
    top: 60,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: WHITE,
  },
  loading: {
    alignSelf: 'center',
    flex: 1,
  },
});

export default App;
