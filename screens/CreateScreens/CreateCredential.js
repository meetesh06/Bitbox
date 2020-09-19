import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {darkThemeColor, darkTheme} from '../Globals/Functions';
import {B_CONTAINER} from '../Globals/Colors';
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
  const colors = [
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
    {
      colorData: ['#d02324', '#9b1335'],
    },
    {
      colorData: ['blue', 'coral'],
    },
  ];
  const {componentId} = useContext(NavigationContext);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otherData, setOtherData] = useState('');
  const BUTTONS = THEME_DATA.BUTTONS;
  const realm = RealmManager.getInstance();

  function createCredential() {
    console.log('date: ', new Date());
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
    console.log(realm.objects(CREDENTIALS_SCHEMA));
  });

  return (
    <>
      <ScrollView
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <TopBar title="Create Credential" context={componentId} />
        <ScrollView
          style={styles.preview}
          decelerationRate={0}
          snapToInterval={DISPLAY_WIDTH} //your element width
          snapToAlignment={'center'}
          horizontal={true} >
          <CredentialCard
            id="12as325"
            title={title}
            content="mee***@gmail.com"
            style={1}
            fullView
            colors={currentColor.colorData}
          />
          <CredentialCard
            id="12as325"
            title={title}
            content="mee***@gmail.com"
            style={2}
            fullView
            colors={currentColor.colorData}
          />
          <CredentialCard
            id="12as325"
            title={title}
            content="mee***@gmail.com"
            style={3}
            fullView
            colors={currentColor.colorData}
          />
        </ScrollView>
        <ColorPicker selectedUpdate={selectedUpdate} colors={colors} />
        <View style={styles.inputsContainer}>
          <Input title="Title" icon="pencil" value={title} updater={setTitle} />
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
              style={darkTheme(BUTTONS.BUTTON4, 'btn')}
              onPress={createCredential}>
              <Text style={darkTheme(BUTTONS.BUTTON4, 'text')}>CREATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
