import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  // Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from 'react-native-navigation-hooks';

// import Carousel from 'react-native-snap-carousel';

// const SLIDER_WIDTH = Dimensions.get('window').width;

const App: () => React$Node = () => {
  const {push} = useNavigation();
  // function renderCard({item, index}) {
  //   return (
  //     <View style={styles.cardStyle}>
  //       <Text style={{fontSize: 30}}>{item.title}</Text>
  //       <Text>{item.text}</Text>
  //     </View>
  //   );
  // }

  function signupScreen() {
    push({
      component: {
        name: 'com.mk0er.Signup',
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

  function loginScreen() {

  }

  return (
    <>
      <LinearGradient
        colors={['#3977de', '#0a938e']}
        style={styles.linearGradient}>
        <View style={styles.carouselContainer}>
          {/* <Carousel
            layout={'tinder'}
            data={[
              {
                title: 'Item 1',
                text: 'Text 1',
              },
              {
                title: 'Item 2',
                text: 'Text 2',
              },
            ]}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={300}
            renderItem={renderCard}
            loop={true}
            containerCustomStyle={styles.carousel}
            layoutCardOffset={'15'}
            activeAnimationType={'decay'}
          /> */}
          <Image
            style={styles.setupImg}
            source={require('../images/Setup1.png')}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button1} onPress={signupScreen}>
              <Text style={styles.button1Text}>SIGN UP</Text>
            </TouchableOpacity>
            <Text style={styles.buttonSeperatorText}>OR</Text>
            <TouchableOpacity style={styles.button2} onPress={loginScreen}>
              <Text style={styles.button2Text}>LOG IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  carouselContainer: {
    justifyContent: 'center',
    padding: 40,
    height: 500,
  },
  cardStyle: {
    backgroundColor: 'floralwhite',
    borderRadius: 20,
    height: 250,
    padding: 50,
    marginLeft: 25,
    marginRight: 25,
  },
  button2: {
    width: '70%',
    borderColor: 'white',
    borderWidth: 2.3,
    padding: 12,
    borderRadius: 15,
  },
  button2Text: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button1: {
    width: '70%',
    borderColor: 'white',
    borderWidth: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  button1Text: {
    textAlign: 'center',
    color: 'rgb(10, 147, 142)',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  buttonSeperatorText: {
    padding: 10,
    fontFamily: 'Poppins-Thin',
    color: '#fff',
  },
  setupImg: {
    // resizeMode: 'contain',
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
