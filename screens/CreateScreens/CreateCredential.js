/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
  BackHandler,
} from 'react-native';
import {darkThemeColor, darkTheme} from '../Globals/Functions';
import {B_CONTAINER, CP_ALL} from '../Globals/Colors';
import {NavigationContext} from 'react-native-navigation-hooks';
import TopBar from '../Components/TopBar';
import CredentialCard from '../Components/CredentialCard';
import ColorPicker from '../Components/ColorPicker';
import Input from '../Components/Input';
import InputTextArea from '../Components/InputTextArea';
import THEME_DATA from '../Globals/ThemeData';
import RealmManager from '../../database/realm';
import {CREDENTIALS_SCHEMA} from '../Globals/Database';
import {Navigation} from 'react-native-navigation';
const DISPLAY_WIDTH = Dimensions.get('window').width;

const App: () => React$Node = () => {
  const {componentId} = useContext(NavigationContext);
  const [currentColor, setCurrentColor] = useState(CP_ALL[0]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otherData, setOtherData] = useState('');
  const BUTTONS = THEME_DATA.BUTTONS;

  function createCredential() {
    console.log('date: ', new Date());
    const realm = RealmManager.getInstance();
    try {
      if (realm) {
        realm.write(() => {
          realm.create(CREDENTIALS_SCHEMA, {
            id: new Date().toString(),
            themeData: JSON.stringify(currentColor),
            title: title,
            email: email,
            password: password,
            details: otherData,
            others: '',
          });
          Navigation.dismissModal(componentId);
        });
      }
    } catch (e) {
      console.log('CREATE CREDENTIAL', e);
    }
  }

  function selectedUpdate(element) {
    setCurrentColor(element);
  }

  useEffect(() => {
    const backAction = () => {
      Navigation.dismissModal(componentId);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [componentId]);

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Create Credential" context={componentId} />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={styles.innerContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={styles.preview}
            decelerationRate={0}
            snapToInterval={DISPLAY_WIDTH} //your element width
            snapToAlignment={'center'}
            horizontal={true}>
            <CredentialCard
              id="12as325"
              title={title}
              content={email === '' ? 'john***@mail.com' : email}
              style={1}
              fullView
              colors={currentColor.colorData}
            />
            <CredentialCard
              id="12as325"
              title={title}
              content={email === '' ? 'john***@mail.com' : email}
              style={2}
              fullView
              colors={currentColor.colorData}
            />
            <CredentialCard
              id="12as325"
              title={title}
              content={email === '' ? 'john***@mail.com' : email}
              style={3}
              fullView
              colors={currentColor.colorData}
            />
          </ScrollView>
          <ColorPicker selectedUpdate={selectedUpdate} colors={CP_ALL} />
          <View style={styles.inputsContainer}>
            <Input
              title="Title"
              icon="pencil"
              value={title}
              updater={setTitle}
            />
            <Input
              title="Email"
              icon="envelope"
              value={email}
              updater={setEmail}
            />
            <Input
              title="Password"
              icon="unlock-alt"
              value={password}
              updater={setPassword}
            />
            <InputTextArea
              placeholder="Other details like security question, etc."
              value={otherData}
              updater={setOtherData}
            />
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                style={{
                  ...darkTheme(BUTTONS.BUTTON4, 'btn'),
                  borderColor: title === '' ? '#bebebe' : '#1e88ae',
                }}
                disabled={title === ''}
                onPress={createCredential}>
                <Text
                  style={{
                    ...darkTheme(BUTTONS.BUTTON4, 'text'),
                    color: title === '' ? '#bebebe' : '#1e88ae',
                  }}>
                  CREATE
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
  innerContainer: {
    flex: 1,
  },
  preview: {
    paddingTop: 30,
  },
  inputsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  bottomButtonContainer: {
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
