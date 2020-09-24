/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  // Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  darkThemeColor,
  callGoogleSignIn,
  performMultipartUpload,
  createRequest,
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

import GDrive from 'react-native-google-drive-api-wrapper';

// const DISPLAY_WIDTH = Dimensions.get('window').width;
const gradientStyles = {
  cloud: ['#3977de', '#0a5e93'],
};

const CloudStatus: () => React$Node = ({
  usesCloud,
  callUpdate,
  loadingContent,
}) => {
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
          Sync With Cloud
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
            color: '#fff',
          }}>
          Uses Cloud: {usesCloud.toString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={callUpdate}
        style={{
          width: 70,
          height: 70,
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 35,
          marginRight: 10,
          marginLeft: 10,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FontAwesomeIcon name="cloud" size={35} color="#fff" />
      </TouchableOpacity>
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

  async function cloudUpdate() {
    const realm = RealmManager.getInstance();
    if (!commonData.getGoogleSignedInSession()) {
      const {error, mssg} = await callGoogleSignIn();
      if (error) {
        return console.error(mssg);
      }
    }
    realm.close();
    let params = await createRequest(commonData.getRemoteTokens().accessToken);
    performMultipartUpload(params, uploadProgress, uploadComplete);
  }

  function uploadProgress(progress) {
    console.log('UPLOAD PROGRESS', progress);
  }

  function uploadComplete(response) {
    console.log('UPLOAD COMPLETE', response);
    RealmManager.reIssueInstance();
  }

  // function getDatabaseFileListing() {
  //   fetch(
  //     'https://www.googleapis.com/drive/v3/files',
  //     {
  //       headers: ''
  //     }
  //   )
  // }

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
    if (!commonData.getRemote()) {
      setLoadingReq1(false);
      return setUserUsesCloud(false);
    }
    setUserUsesCloud(true);
    const signInCheck = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        const tokens = await GoogleSignin.getTokens();
        console.log('SILENT LOGIN SUCCESSFUL: ', tokens.accessToken);
        commonData.setRemoteTokens(tokens);
        commonData.setRemoteUserData(userInfo);
        commonData.setGoogleSignedInSession(true);
        // GDrive.setAccessToken(tokens.accessToken);
        // GDrive.init();
        // GDrive.files
        //   .list({q: "name = 'BITBOX.realm'"})
        //   .then((res) => res.json())
        //   .then((jsonData) => {
        //     console.log(jsonData);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        // GDrive.files
        //   // .get('1KwFxoi7IGXrPtEg0yqK_VHnw2tsQ89pncgfWmuzhawiFNs9e', {})
        //   .get('1CNkSXLWV4RB7jlFSbuCfh3jaR_nwBGRbXlLwSDfRN_opaU8E', {})
        //   .then((res) => res.json())
        //   .then((jsonData) => {
        //     console.log(jsonData);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        fetch(
          // "https://www.googleapis.com/drive/v3/files?q=name = 'BITBOX.realm'",
          "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name = 'BITBOX.realm'&fields=files/id, files/modifiedTime&orderBy=modifiedTime desc",
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          },
        )
          .then((res) => res.json())
          .then((val) => console.log(val))
          .catch((err) => console.log(err));
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          commonData.setGoogleSignedInSession(false);
        } else {
          console.error('GOOGLE ERROR', error);
        }
      } finally {
        setLoadingReq1(false);
      }
    };
    signInCheck();
  }, [commonData]);

  useEffect(() => {
    // DOWNLOAD DATABASE FILE
    // RNFS.downloadFile({
    //   headers: {
    //     Authorization: `Bearer ${commonData.getRemoteTokens().accessToken}`,
    //   },
    //   fromUrl:
    //     'https://www.googleapis.com/drive/v3/files/1bbBeuR-KdyvGTsvpNZA4TP5o1Q3kZiF9?alt=media',
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
          loading={loadingContent || loadingReq1}
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
