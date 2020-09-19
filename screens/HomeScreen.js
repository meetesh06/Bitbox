/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from './Globals/Functions';
import {
  B_CONTAINER,
  PRIMARY,
  WHITE,
  ACCENT,
  B_TOPBAR_TITLE,
} from './Globals/Colors';
// import FAB from 'react-native-fab';
import Fab from 'rn-fab';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from 'react-native-navigation-hooks';
import {useNavigationCommandComplete} from 'react-native-navigation-hooks';
import TopBar from './Components/TopBar';
import CommonDataManager from './Globals/CommonDataManager';

import CredentialCard from './Components/CredentialCard';
import {CREDENTIALS_SCHEMA} from './Globals/Database';
import RealmManager from '../database/realm';

const HorizontalListView: () => React$Node = ({
  title,
  elements,
  elementContentKey,
  handler,
}) => {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}>
      <Text
        style={{
          padding: 10,
          fontSize: 18,
          fontFamily: 'Poppins-Bold',
          color: darkThemeColor(B_TOPBAR_TITLE),
        }}>
        {title}
      </Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {elements &&
          elements.map((element) => {
            return (
              <TouchableOpacity onPress={() => handler(element)}>
                <CredentialCard
                  id={element.id}
                  title={element.title}
                  content={element[elementContentKey]}
                  style={3}
                  horizontalList
                  colors={JSON.parse(element.themeData).colorData}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

const App: () => React$Node = () => {
  const {showOverlay, showModal} = useNavigation();
  const [topBarTitle, setTopBarTitle] = useState('Hello');
  const [credentialList, setCredentialList] = useState([]);
  const [update, setUpdate] = useState(true);
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
        },
      },
    });
  }

  function showCreateOverlay() {
    setOverlay(true);
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
    let size = 10;
    let items = realm
      .objects(CREDENTIALS_SCHEMA)
      .sorted('id', true)
      .slice(0, size);
    setCredentialList(items);
  }, [realm, update]);

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
          title={'CREDENTIALS'}
          elementContentKey={'email'}
          elements={credentialList}
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
          // showCreateOverlay();
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
