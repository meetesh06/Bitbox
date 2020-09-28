/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from 'react-native-navigation-hooks';

import {B_CONTAINER, PRIMARY, B_INNER} from './Globals/Colors';

import THEME_DATA from './Globals/ThemeData';
import {
  darkTheme,
  darkThemeColor,
  callGoogleSignIn,
  getDatabaseFileList,
  downloadDatabaseFile,
  refreshToken,
  updateRemoteStatus,
} from './Globals/Functions';

import TopBar from './Components/TopBar';
import {API_URL} from './Globals/AsyncStorageEnum';
import CommonDataManager from './Globals/CommonDataManager';

import {GoogleSignin} from '@react-native-community/google-signin';

const App: () => React$Node = () => {
  const {setStackRoot} = useNavigation();
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('STARTING');
  const [creationError, setCreationError] = useState(false);
  const BUTTONS = THEME_DATA.BUTTONS;
  const ANIMATIONS = THEME_DATA.ANIMATIONS;

  function handleNextPage() {
    setStackRoot({
      component: {
        name: 'com.mk1er.MasterLogin',
        options: {
          topBar: {
            visible: false,
          },
          animations: ANIMATIONS.PP,
        },
      },
    });
  }

  async function googleSignIn() {
    const commonData = CommonDataManager.getInstance();
    const {error, mssg} = await callGoogleSignIn();
    setLoading(true);
    console.log('USING TOKEN: ', commonData.getApiToken());
    if (error === false) {
      const tokens = await GoogleSignin.getTokens();
      commonData.setRemoteTokens(tokens);
      commonData.setGoogleSignedInSession(true);
      const params = {
        token: commonData.getApiToken(),
        status: true,
      };
      fetch(API_URL + '/remote-status-update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then(async (result) => {
          console.log('UPDATE: ', result);
          if (result.error === false) {
            try {
              await refreshToken(result.data.token);
              await updateRemoteStatus('true');
            } catch (e) {
              setCreationError('UNKNOWN ERROR OCCURED');
              console.error('TOKEN REFRESH SAVING ERROR', e);
              return setLoading(false);
            }

            getDatabaseFileList(commonData.getRemoteTokens().accessToken)
              .then((res) => res.json())
              .then((val) => {
                val.files = val.files.map((v) => {
                  v.modifiedTime = new Date(v.modifiedTime);
                  return v;
                });
                if (val.files.length !== 0) {
                  setDownloading(true);
                  downloadDatabaseFile(
                    val.files[0].id,
                    commonData.getRemoteTokens().accessToken,
                    () => console.log('Download Started'),
                    (progress) => {
                      let progressPercent =
                        (progress.loaded / progress.total) * 100;
                      setDownloadProgress(progressPercent + '%');
                    },
                  )
                    .then((comp) => {
                      console.log(comp);
                      if (comp.statusCode === 200) {
                        setDownloadProgress('DOWNLOADED');
                        handleNextPage();
                      } else {
                        setDownloadProgress('DOWNLOAD FAILED');
                        console.error('DOWNLOAD FAILED');
                        setDownloading(false);
                      }
                    })
                    .catch((e) => {
                      console.log('ERROR: ', e);
                      setDownloadProgress('DOWNLOAD FAILED');
                      setDownloading(false);
                    });
                } else {
                  // GOTO MASTER KEY PAGE, WITH NO EXISTIG BACKUP TO BE LOADAED
                }
              })
              .catch((err) => {
                setDownloading(true);
              });
          } else {
            setCreationError(result.mssg);
            setLoading(false);
            commonData.setRemote(false);
          }
        })
        .catch((err) => {
          commonData.setRemote(false);
          setLoading(false);
        });
    } else {
      console.log('SIGN IN FAILURE', mssg);
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
        <TopBar title="Restore Google Backup" />
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'handled'}>
          <View
            style={{
              ...styles.cardContainer,
              backgroundColor: darkThemeColor(B_INNER),
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 20,
                textAlign: 'center',
              }}>
              {downloading &&
                'A backup was found in your google drive, restoring'}
              {!downloading &&
                'Login with google to restore your existing backup'}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                textAlign: 'center',
              }}>
              {!downloading && 'Downloading the data might take a few minutes.'}
              {downloading && downloadProgress}
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
                style={darkTheme(BUTTONS.BUTTON4, 'btn')}
                onPress={googleSignIn}>
                <Text style={darkTheme(BUTTONS.BUTTON4, 'text')}>
                  {!loading && 'Sign In with Google'}
                  {loading && (
                    <ActivityIndicator
                      style={styles.loading}
                      size="large"
                      color={PRIMARY}
                    />
                  )}
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
  },
  scrollView: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
  },
  submitContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    height: 300,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
  },
});

export default App;
