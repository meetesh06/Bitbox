/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from './Globals/Functions';
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

import GDrive from 'react-native-google-drive-api-wrapper';
import {GoogleSignin} from '@react-native-community/google-signin';

const App: () => React$Node = () => {
  const {showOverlay, showModal} = useNavigation();
  const [topBarTitle, setTopBarTitle] = useState('Hello');
  const [credentialList, setCredentialList] = useState([]);
  const [update, setUpdate] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
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
  const realm = RealmManager.getInstance();

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
          // animations: {
          //   showModal: {
          //     alpha: {
          //       from: 0,
          //       to: 1,
          //       duration: 600,
          //     },
          //   },
          //   dismissModal: {
          //     alpha: {
          //       from: 1,
          //       to: 0,
          //       duration: 200,
          //     },
          //   },
          // },
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

  useEffect(() => {
    setTopBarTitle('Hello, ' + commonData.getUsername().split(' ')[0]);
  }, [commonData]);

  useEffect(() => {
    // Update Local data
    let size = 6;
    let items = realm
      .objects(CREDENTIALS_SCHEMA)
      .sorted('id', true)
      .slice(0, size);
    setCredentialList(items);
    setLoadingContent(false);
    console.log(realm.path, items);
  }, [realm, update]);

  // useEffect(() => {
  //   // GDrive.setAccessToken(accessToken);
  //   async function getTokens() {
  //     try {
  //       const tokens = await GoogleSignin.getTokens();
  //       console.log('USING TOKEN: ' + tokens.accessToken);
  //       GDrive.setAccessToken(tokens.accessToken);
  //       GDrive.init();
  //       console.log(GDrive.isInitialized());
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   getTokens();
  // });
  useEffect(() => {
    console.log('REMOTE: ', commonData.getRemote());
    if (!commonData.getRemote()) {
      return setUserUsesCloud(false);
    }
    const signInCheck = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (!isSignedIn) {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          commonData.setRemoteUserData(userInfo);
          console.log('USER INFO', userInfo);
        } catch (error) {}
      }
    };
    console.log('SIGN IN CHECK');

    signInCheck();
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
