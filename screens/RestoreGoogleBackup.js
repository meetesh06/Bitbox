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
} from './Globals/Functions';

import TopBar from './Components/TopBar';
import {API_URL, REMOTE_BACKUP, TOKEN} from './Globals/AsyncStorageEnum';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import CommonDataManager from './Globals/CommonDataManager';

import {GoogleSignin} from '@react-native-community/google-signin';

import Realm from 'realm';

const App: () => React$Node = () => {
  const {setStackRoot, pop} = useNavigation();
  const [email, setEmail] = useState('');
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const BUTTONS = THEME_DATA.BUTTONS;
  const commonData = CommonDataManager.getInstance();

  async function handleNextPage() {
    console.log('NEXT PAGE');
  }

  async function googleSignIn() {
    const {error, mssg} = await callGoogleSignIn();
    setLoading(true);
    console.log('USING TOKEN: ', commonData.getApiToken());
    if (error === false) {
      const tokens = await GoogleSignin.getTokens();
      commonData.setRemoteTokens(tokens);
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
            await RNSecureKeyStore.set(REMOTE_BACKUP, 'true', {
              accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
            });
            await RNSecureKeyStore.set(TOKEN, result.data.token, {
              accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
            });
            commonData.setRemote(true);
            commonData.setApiToken(result.data.token);
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
                    (p) => console.log('PROGRESS: ', p),
                  )
                    .then((comp) => {
                      console.log(comp);
                      if (comp.statusCode === 200) {
                        console.log('DOWNLOAD SUCCESS');
                        handleNextPage();
                      }
                      setDownloading(false);
                    })
                    .catch((e) => {
                      console.log('ERROR: ', e);
                    });
                }
              })
              .catch((err) => {
                setDownloading(true);
              });
            commonData.setGoogleSignedInSession(true);
            setGoogleSignedIn(true);
          } else {
            commonData.setRemote(false);
          }
          setLoading(false);
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

  async function continueWithoutLogin() {
    const params = {
      token: commonData.getApiToken(),
      status: false,
    };
    commonData.setGoogleSignedInSession(false);
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
        if (result.error === false) {
          await RNSecureKeyStore.set(REMOTE_BACKUP, 'false', {
            accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
          });
          await RNSecureKeyStore.set(TOKEN, result.data.token, {
            accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
          });
          commonData.setRemote(false);
          commonData.setApiToken(result.data.token);
        } else {
          commonData.setRemote(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        commonData.setRemote(false);
        setLoading(false);
      });
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
          {downloading && (
            <View
              style={{
                backgroundColor: darkThemeColor(B_INNER),
                height: 300,
                borderRadius: 12,
                padding: 20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                A backup was found in your google drive, restoring
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Downloading might take a few minutes.
              </Text>
            </View>
          )}
          {!downloading && (
            <View
              style={{
                backgroundColor: darkThemeColor(B_INNER),
                height: 300,
                borderRadius: 12,
                padding: 20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Please login with google to restore existing backup.
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                If there are no backups, a new backup will be created.
              </Text>
            </View>
          )}

          <View style={styles.submitContainer}>
            <View style={styles.buttonContainer}>
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
              {!loading && (
                <View
                  style={{
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}>
                  <Text style={styles.buttonSeperatorText}>OR</Text>
                  <TouchableOpacity
                    style={darkTheme(BUTTONS.BUTTON5, 'btn')}
                    onPress={continueWithoutLogin}>
                    <Text style={darkTheme(BUTTONS.BUTTON5, 'text')}>
                      Continue without backup (existing backup will be deleted)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
  buttonSeperatorText: {
    padding: 10,
    fontFamily: 'Poppins-Thin',
    textAlign: 'center',
    color: '#a0a0a0',
  },
});

export default App;
