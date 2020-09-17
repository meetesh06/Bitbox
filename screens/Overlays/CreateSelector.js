import React, {useContext, useRef, useEffect} from 'react';
import {
  Text,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NavigationContext} from 'react-native-navigation-hooks';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {B_OVERLAY, PRIMARY, WHITE} from '../Globals/Colors';

import THEME_DATA from '../Globals/ThemeData';
import {darkTheme, darkThemeColor} from '../Globals/Functions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Alert() {
  const {componentId} = useContext(NavigationContext);
  const BUTTONS = THEME_DATA.BUTTONS;
  const OVERLAY = THEME_DATA.OVERLAY;

  const top = useRef(new Animated.Value(windowHeight)).current;
  function dismiss() {
    Animated.timing(top, {
      toValue: windowHeight,
      duration: 300,
    }).start(() => Navigation.dismissOverlay(componentId));
  }

  useEffect(() => {
    Animated.timing(top, {
      toValue: windowHeight / 2,
      duration: 300,
    }).start();
  }, [top]);

  function createCredential() {
    Animated.timing(top, {
      toValue: windowHeight,
      duration: 300,
    }).start(() => {
      Navigation.dismissOverlay(componentId);
    });

    Navigation.showModal({
      component: {
        name: 'com.mk2er.CreateCredential',
        options: {
          topBar: {
            visible: false,
          },
          animations: {
            showModal: {
              alpha: {
                from: 0,
                to: 1,
                duration: 400,
              },
            },
          },
        },
      },
    });
  }

  return (
    <>
      <View>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.outsideTouch} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.root,
            top,
            backgroundColor: darkThemeColor(B_OVERLAY),
          }}
          useNativeDriver={true}>
          <Text style={darkTheme(OVERLAY.HEADINGS.HEADING1, 'text')}>
            Create a new
          </Text>
          <View style={styles.buttonHolder}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{
                  ...darkTheme(BUTTONS.BUTTON6, 'btn'),
                  backgroundColor: PRIMARY,
                }}
                onPress={createCredential}>
                <FontAwesomeIcon name="unlock" size={20} color={WHITE} />
              </TouchableOpacity>
              <Text style={darkTheme(OVERLAY.INFO.INFO1, 'text')}>
                CREDENTIAL {'\n'} (Website, App account's, etc.)
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = {
  root: {
    backgroundColor: WHITE,
    height: windowHeight / 2,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
  },
  outsideTouch: {
    height: windowHeight,
    width: windowWidth,
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  buttonContainer: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    padding: 5,
  },
};

Alert.options = (props) => {
  return {
    overlay: {
      interceptTouchOutside: true,
    },
  };
};

module.exports = Alert;
