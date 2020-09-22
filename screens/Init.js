import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import TypeWriter from 'react-native-typewriter';
import {useNavigation} from 'react-native-navigation-hooks';
import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme} from './Globals/Functions';

import LinearGradient from 'react-native-linear-gradient';

import {goToHome} from './Navigators/HomeNav';
import CommonDataManager from './Globals/CommonDataManager';

const App: () => React$Node = () => {
  const {push} = useNavigation();

  const [subHeading, setSubHeading] = useState(
    'protect your privacy online.  ',
  );
  const [sCount, setSCount] = useState(0);
  const [signedIn, setSignedIn] = useState(true);
  const [sCountTyping, setSCountTyping] = useState(1);

  const BUTTONS = THEME_DATA.BUTTONS;
  const commonData = CommonDataManager.getInstance();

  function smallHeadingHandler() {
    if (sCount === 0) {
      setSCountTyping(-1);
      setSCount(1);
    } else if (sCount === 1) {
      setSubHeading('bb9471722fc647454ee7a58c3...');
      setSCount(2);
    } else {
      setSubHeading('Protect your accounts from hackers');
      setSCountTyping(1);
    }
  }

  function handleNextScreen() {
    setSCount(-1);
    push({
      component: {
        name: 'com.mk0er.Setup1',
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
    if (commonData.getSignedIn() && commonData.getMasterKeyStatus()) {
      let timer1 = setTimeout(() => goToHome(push), 1000);
      return () => {
        clearTimeout(timer1);
      };
    } else {
      setSignedIn(false);
    }
  }, [commonData, push]);

  return (
    <>
      <LinearGradient colors={gradientStyles.bitbox} style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImg}
            source={require('../images/logo.png')}
          />
        </View>

        <View style={styles.textContainer}>
          <TypeWriter style={styles.bigHeader} fixed={true} typing={1}>
            Welcome to Bitbox.
          </TypeWriter>
          <TypeWriter
            onTypingEnd={smallHeadingHandler}
            style={styles.bigSubHeader}
            fixed={true}
            typing={sCountTyping}>
            {subHeading}
          </TypeWriter>
        </View>

        <View style={styles.bottomButtonContainer}>
          {signedIn && <ActivityIndicator size="large" color="#fff" />}
          {!signedIn && (
            <TouchableOpacity
              style={ignoreTheme(BUTTONS.BUTTON1, 'btn')}
              onPress={handleNextScreen}>
              <Text style={ignoreTheme(BUTTONS.BUTTON1, 'text')}>START</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.madeInIndiaText}>MADE IN INDIA</Text>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  bigHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
    textAlign: 'center',
    color: '#fff',
  },
  bigSubHeader: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  logoImg: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  madeInIndiaText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins-Thin',
    marginBottom: 20,
  },
});

const gradientStyles = {
  bitbox: ['#3977de', '#0a938e'],
};

export default App;
