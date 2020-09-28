/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {
  darkThemeColor,
  callGoogleSignIn,
  performMultipartUpload,
  createRequest,
  getDatabaseFileList,
  refreshToken,
  updateRemoteStatus,
} from './Globals/Functions';
import {B_CONTAINER, PRIMARY, WHITE, ACCENT} from './Globals/Colors';
import Fab from 'rn-fab';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {
  useNavigation,
  useNavigationCommandComplete,
} from 'react-native-navigation-hooks';
import TopBar from './Components/TopBar';
import CommonDataManager from './Globals/CommonDataManager';

import HorizontalListView from './Components/HorizontalListView';
import CloudStatus from './Components/CloudStatus';
import {CREDENTIALS_SCHEMA} from './Globals/Database';
import RealmManager from '../database/realm';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {API_URL} from './Globals/AsyncStorageEnum';
import THEME_DATA from './Globals/ThemeData';

// LOADING REQ 1 -> TOKEN ACQUISITION
// LOADING REQ 2 -> GET CLOUD HISTORY
// LOADING REQ 3 -> ENABLE GOOGLE DRIVE REMOTE BACKUPS

// const DISPLAY_WIDTH = Dimensions.get('window').width;
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
  const ANIMATIONS = THEME_DATA.ANIMATIONS;

  const [loadingReq2, setLoadingReq2] = useState(true);
  const [loadingReq3, setLoadingReq3] = useState(false);
  const [uploadProgressPercent, setUploadProgressPercent] = useState(
    'BACKUP NOW',
  );
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
          animations: ANIMATIONS.PP,
        },
      },
    });
  }

  async function signInCallback() {
    const params = {
      token: commonData.getApiToken(),
      status: true,
    };
    setLoadingReq3(true);
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
          await refreshToken(result.data.token);
          await updateRemoteStatus('true');
          setUpdate(!update);
          setLoadingReq3(false);
        } else {
          commonData.setRemote(false);
          setLoadingReq3(false);
        }
      })
      .catch((err) => {
        commonData.setRemote(false);
        setLoadingReq3(false);
      });
    const {error, mssg} = await callGoogleSignIn();
    if (error === false) {
      console.log('SIGN IN SUCCESS', mssg);
      setUpdate(!update);
    } else {
      console.log('SIGN IN FAILURE', mssg);
    }
  }

  async function cloudUpdate(animation) {
    function uploadProgress(progress) {
      let progressPercent = (progress.loaded / progress.total) * 100;
      setUploadProgressPercent(progressPercent + '%');
    }

    function uploadComplete(response) {
      RealmManager.reIssueInstance();
      animation.current.reset();
      setUploadProgressPercent('COMPLETED');
      setLoadingReq2(true);
      getDatabaseFileList(commonData.getRemoteTokens().accessToken)
        .then((res) => res.json())
        .then((val) => {
          val.files = val.files.map((v) => {
            v.modifiedTime = new Date(v.modifiedTime);
            return v;
          });
          setCloudHistory(val.files);
          setLoadingReq2(false);
          setUpdate(!update);
        })
        .catch((err) => {
          setLoadingReq2(false);
          setCloudHistory([]);
          console.error(err);
        });
    }

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
    const realm = RealmManager.getInstance();
    realm.close();
    let params = await createRequest(commonData.getRemoteTokens().accessToken);
    let fileId = null;
    fileId = cloudHistory.length === 0 ? null : cloudHistory[0].id;
    performMultipartUpload(fileId, params, uploadProgress, uploadComplete);
  }

  useEffect(() => {
    setTopBarTitle('Hello, ' + commonData.getUsername().split(' ')[0]);
  }, [commonData, update]);

  function updateLocalData() {
    setLoadingContent(true);
    let realm = RealmManager.getInstance();
    console.log('UPDATING LOCAL DATA');
    let size = 6;
    let items = realm
      .objects(CREDENTIALS_SCHEMA)
      .sorted('id', true)
      .slice(0, size);
    setCredentialList(JSON.parse(JSON.stringify(items)));
    setLoadingContent(false);
  }

  // TRY SILENT SIGN IN AND DATABSE LISTING
  useEffect(() => {
    function updateList() {
      getDatabaseFileList(commonData.getRemoteTokens().accessToken)
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
        updateList();
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
    updateLocalData();
    if (!commonData.getRemote()) {
      setLoadingReq1(false);
      setLoadingReq2(false);
      setUserUsesCloud(false);
      return;
    }
    setUserUsesCloud(true);
    signInCheck();
    return () => {
      updateList();
      signInCheck();
    };
  }, [commonData, update]);

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
          loading={loadingContent || loadingReq1 || loadingReq2 || loadingReq3}
          cloudHistory={cloudHistory}
          uploadProgress={uploadProgressPercent}
          signInCallback={signInCallback}
        />
        <HorizontalListView
          handler={() => {
            console.log('credentials click');
            let realm = RealmManager.getInstance();
            realm.close();
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
