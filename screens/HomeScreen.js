/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from './Globals/Functions';
import {B_CONTAINER, PRIMARY} from './Globals/Colors';
import FAB from 'react-native-fab';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from 'react-native-navigation-hooks';
import { useNavigationCommandComplete } from 'react-native-navigation-hooks';

const App: () => React$Node = () => {
  const {showOverlay} = useNavigation();
  const [overlay, setOverlay] = useState(false);

  useNavigationCommandComplete(({commandName}) => {
    if (commandName === 'dismissOverlay') {
      setOverlay(false);
    }
  });

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

  return (
    <>
      <ScrollView
        nestedScrollEnabled={true}
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <Text
          style={{
            height: 900,
            color: '#fff',
          }}>
          Home Screen
        </Text>
      </ScrollView>
      <FAB
        buttonColor={PRIMARY}
        iconTextColor="#FFFFFF"
        onClickAction={showCreateOverlay}
        visible={!overlay}
        iconTextComponent={<FontAwesomeIcon name="pencil" />}
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
