import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import TypeWriter from 'react-native-typewriter';
import {useNavigation} from 'react-native-navigation-hooks';
import THEME_DATA from './Globals/ThemeData';
import {ignoreTheme} from './Globals/Functions';

import {goToHome} from './Navigators/HomeNav'

const App: () => React$Node = () => {
  const {push, setStackRoot} = useNavigation();

  const [subHeading, setSubHeading] = useState(
    'protect your privacy online.  ',
  );
  const [sCount, setSCount] = useState(0);
  const [sCountTyping, setSCountTyping] = useState(1);

  const BUTTONS = THEME_DATA.BUTTONS;

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
    // push({
    //   component: {
    //     name: 'com.mk0er.Setup1',
    //     options: {
    //       topBar: {
    //         visible: false,
    //       },
    //       animations: {
    //         push: {
    //           content: {
    //             alpha: {
    //               from: 0,
    //               to: 1,
    //               duration: 200,
    //             },
    //           },
    //         },
    //         pop: {
    //           content: {
    //             alpha: {
    //               from: 1,
    //               to: 0,
    //               duration: 100,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    goToHome(push);
  }

  return (
    <>
      <AnimatedLinearGradient customColors={gradientStyles.bitbox} speed={8000}>
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
          <TouchableOpacity
            style={ignoreTheme(BUTTONS.BUTTON1, 'btn')}
            onPress={handleNextScreen}>
            <Text style={ignoreTheme(BUTTONS.BUTTON1, 'text')}>START</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.madeInIndiaText}>MADE IN INDIA</Text>
      </AnimatedLinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
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
  bitbox: ['rgb(57, 119, 222)', 'rgb(10, 147, 142)', 'rgb(29, 52, 134)'],
};

export default App;
