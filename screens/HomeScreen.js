/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  ScrollView,
  // Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  darkThemeColor,
  callGoogleSignIn,
  performMultipartUpload,
  createRequest,
  performMultipartUpdate,
} from './Globals/Functions';
import {B_CONTAINER, PRIMARY, WHITE, ACCENT} from './Globals/Colors';
// import FAB from 'react-native-fab';
import Fab from 'rn-fab';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from 'react-native-navigation-hooks';
import {useNavigationCommandComplete} from 'react-native-navigation-hooks';
import TopBar from './Components/TopBar';
import CommonDataManager from './Globals/CommonDataManager';

import HorizontalListView from './Components/HorizontalListView';
import {CREDENTIALS_SCHEMA} from './Globals/Database';
import RealmManager from '../database/realm';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import GDrive from 'react-native-google-drive-api-wrapper';
import RNFS from 'react-native-fs';

// LOADING REQ 1 -> TOKEN ACQUISITION
// LOADING REQ 2 -> GET CLOUD HISTORY

// const DISPLAY_WIDTH = Dimensions.get('window').width;
const gradientStyles = {
  cloud: ['#3977de', '#0a5e93'],
};

const CloudStatus: () => React$Node = ({
  usesCloud,
  callUpdate,
  lastBackup,
  loading,
  cloudHistory,
  uploadProgress,
}) => {
  const commonData = CommonDataManager.getInstance();
  const animation = useRef(null);
  return (
    <LinearGradient
      colors={gradientStyles.cloud}
      style={{
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
      }}>
      {loading === false &&
        usesCloud === true &&
        commonData.getGoogleSignedInSession() && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 40,
              }}
              source={{
                uri: commonData.getRemoteUserData().user.photo,
              }}
            />
          </View>
        )}
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-Bold',
            textAlign: 'center',
            color: '#fff',
          }}>
          {loading === false && usesCloud === true && 'Ready to Sync'}
        </Text>
        {loading === false && usesCloud === false && (
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                top: -10,
              }}>
              Sign in to google drive
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                top: -10,
              }}>
              Your data will be backed up to your google drive folder
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={{
            fontSize: 9,
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
            color: '#fff',
          }}>
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
      {loading === false && usesCloud === true && (
        <TouchableOpacity
          onPress={() => {
            console.log('call update');
            callUpdate(animation);
          }}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            source={require('../animations/lf30_editor_09islqra.json')}
            style={{
              width: 80,
              height: 80,
            }}
            autoSize
            loop
            ref={animation}
          />
          <Text
            style={{
              position: 'absolute',
              top: 60,
              fontSize: 10,
              fontFamily: 'Poppins-Regular',
              color: WHITE,
            }}>
            {uploadProgress}
          </Text>
          {/* <FontAwesomeIcon name="cloud" size={35} color="#fff" /> */}
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const App: () => React$Node = () => {
  const {showOverlay, showModal} = useNavigation();
  const [topBarTitle, setTopBarTitle] = useState('Hello');
  const [credentialList, setCredentialList] = useState([]);
  const [update, setUpdate] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingReq1, setLoadingReq1] = useState(true);
  const actions = [
    // main button
    {
      icon: <FontAwesomeIcon name="plus" size={15} color={WHITE} />,
      name: 'btn_plus',
      color: PRIMARY,
    },
    {
      text: 'Others',
      icon: <FontAwesomeIcon name="pencil" color={WHITE} />,
      name: 'others',
      color: ACCENT,
    },
    {
      text: 'Credential',
      icon: <FontAwesomeIcon name="unlock-alt" color={WHITE} />,
      name: 'credential',
      color: ACCENT,
    },
  ];
  const [userUsesCloud, setUserUsesCloud] = useState(false);
  const commonData = CommonDataManager.getInstance();

  const [loadingReq2, setLoadingReq2] = useState(true);
  const [uploadProgressPercent, setUploadProgressPercent] = useState('');
  const [cloudHistory, setCloudHistory] = useState([]);

  useNavigationCommandComplete(({commandName}) => {
    if (commandName === 'dismissModal') {
      setUpdate(!update);
    }
  });

  function navigateCredential() {
    showModal({
      component: {
        name: 'com.mk2er.CreateCredential',
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    });
  }

  function showCreateOverlay() {
    showOverlay({
      component: {
        id: 'CreateSelector',
        name: 'com.mk2er.CreateSelector',
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

  async function cloudUpdate(animation) {
    function uploadProgress(progress) {
      console.log('UPLOAD PROGRESS', progress);
      let progressPercent = (progress.loaded / progress.total) * 100;
      setUploadProgressPercent(progressPercent + '%');
    }

    function uploadComplete(response) {
      console.log('UPLOAD COMPLETE', response);
      RealmManager.reIssueInstance();
      animation.current.reset();
      setUploadProgressPercent('COMPLETED');
      fetch(
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = 'BITBOX.realm'&fields=files/id, files/modifiedTime&orderBy=modifiedTime desc",
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${commonData.getRemoteTokens().accessToken}`,
          },
        },
      )
        .then((res) => res.json())
        .then((val) => {
          // console.log(val);
          val.files = val.files.map((v) => {
            console.log(v);
            v.modifiedTime = new Date(v.modifiedTime);
            return v;
          });
          setCloudHistory(val.files);
          setLoadingReq2(false);
        })
        .catch((err) => {
          setLoadingReq2(false);
          setCloudHistory([]);
          console.error(err);
        });
    }

    const realm = RealmManager.getInstance();
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) {
      if (commonData.getGoogleSignedInSession()) {
        let userInfo = await GoogleSignin.signInSilently();
        const tokens = await GoogleSignin.getTokens();
        commonData.setRemoteTokens(tokens);
        commonData.setRemoteUserData(userInfo);
      } else {
        const {error, mssg} = await callGoogleSignIn();
        if (error) {
          return console.error(mssg);
        }
      }
    }
    animation.current.play();
    realm.close();
    let params = await createRequest(commonData.getRemoteTokens().accessToken);
    if (cloudHistory.length === 0) {
      // NO EXISTING BACKUP
      performMultipartUpload(null, params, uploadProgress, uploadComplete);
    } else {
      // UPDATE EXISTING FILE
      performMultipartUpload(
        cloudHistory[0].id,
        params,
        uploadProgress,
        uploadComplete,
      );
    }
  }

  useEffect(() => {
    setTopBarTitle('Hello, ' + commonData.getUsername().split(' ')[0]);
  }, [commonData]);

  // UPDATE HOMEPAGE LOCAL DATA
  useEffect(() => {
    const realm = RealmManager.getInstance();
    // Update Local data
    let size = 6;
    let items = realm
      .objects(CREDENTIALS_SCHEMA)
      .sorted('id', true)
      .slice(0, size);
    setCredentialList(items);
    setLoadingContent(false);
  }, []);

  // TRY SILENT SIGN IN
  useEffect(() => {
    function getDatabaseFileListing() {
      fetch(
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = 'BITBOX.realm'&fields=files/id, files/modifiedTime&orderBy=modifiedTime desc",
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${commonData.getRemoteTokens().accessToken}`,
          },
        },
      )
        .then((res) => res.json())
        .then((val) => {
          val.files = val.files.map((v) => {
            v.modifiedTime = new Date(v.modifiedTime);
            return v;
          });
          setCloudHistory(val.files);
          setLoadingReq2(false);
        })
        .catch((err) => {
          setLoadingReq2(false);
          setCloudHistory([]);
          console.error(err);
        });
    }
    // function deleteOlder() {
    //   fetch(
    //     'https://www.googleapis.com/drive/v3/files/1lry0jTHKpRyVjvKgaVHKEg520WVH-w6YcVSfFupu7Is5LVOR',
    //     {
    //       method: 'DELETE',
    //       headers: {
    //         Authorization: `Bearer ${commonData.getRemoteTokens().accessToken}`,
    //       },
    //     },
    //   )
    //     .then((val) => console.log('DELETED: ', val))
    //     .catch((err) => console.log(err));
    // }
    async function signInCheck() {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        let userInfo = null;
        if (!isSignedIn) {
          userInfo = await GoogleSignin.signInSilently();
        } else {
          userInfo = await GoogleSignin.getCurrentUser();
        }
        if (userInfo === null) {
          commonData.setGoogleSignedInSession(false);
          console.error('ERROR GETTING USER DATA');
          return;
        }
        const tokens = await GoogleSignin.getTokens();
        // GET THE TOKENS FROM SILENT LOGIN
        commonData.setRemoteTokens(tokens);
        commonData.setRemoteUserData(userInfo);
        commonData.setGoogleSignedInSession(true);
        // console.log(userInfo.user.photo);
        getDatabaseFileListing();
        // deleteOlder();
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          commonData.setGoogleSignedInSession(false);
        } else {
          console.error('GOOGLE ERROR', error);
        }
      } finally {
        setLoadingReq1(false);
      }
    }
    if (!commonData.getRemote()) {
      setLoadingReq1(false);
      setLoadingReq2(false);
      setUserUsesCloud(false);
      return;
    }
    setUserUsesCloud(true);
    signInCheck();
    return () => {
      getDatabaseFileListing();
      signInCheck();
    };
  }, [commonData]);

  useEffect(() => {
    // DOWNLOAD DATABASE FILE
    // RNFS.downloadFile({
    //   headers: {
    //     Authorization: `Bearer ${commonData.getRemoteTokens().accessToken}`,
    //   },
    //   fromUrl:
    //     'https://www.googleapis.com/drive/v3/files/1IpaOEfaittlUpJCXalXfpvp01Nb-_P19-zSWIM93r9kV2d6Z?alt=media',
    //   toFile: RNFS.DocumentDirectoryPath + '/DOWNLOADED.realm',
    //   begin: (res) => {
    //     console.log(res);
    //   },
    //   progress: (data) => {
    //     console.log(data);
    //   },
    //   background: true,
    //   progressDivider: 1,
    // }).promise.then((r) => {
    //   console.log(r);
    // });
  }, [commonData]);

  return (
    <>
      <ScrollView
        nestedScrollEnabled={true}
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title={topBarTitle} />
        <CloudStatus
          usesCloud={userUsesCloud}
          callUpdate={cloudUpdate}
          lastBackup={cloudHistory}
          loading={loadingContent || loadingReq1 || loadingReq2}
          cloudHistory={cloudHistory}
          uploadProgress={uploadProgressPercent}
        />
        <HorizontalListView
          handler={() => {
            console.log('credentials click');
          }}
          sectionHandler={() => {
            console.log('credentials section click');
          }}
          title={'CREDENTIALS'}
          elementContentKey={'email'}
          elements={credentialList}
          style={3}
          newHandler={navigateCredential}
          loading={loadingContent}
        />
      </ScrollView>
      <Fab
        actions={actions}
        style={{right: 40, bottom: 80}}
        rotation={'45deg'}
        onPress={(name) => {
          if (name === 'credential') {
            navigateCredential();
          } else {
            showCreateOverlay();
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
