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
// import Carousel from 'react-native-snap-carousel';

// const SLIDER_WIDTH = Dimensions.get('window').width;

const App: () => React$Node = () => {
  // function renderCard({item, index}) {
  //   return (
  //     <View style={styles.cardStyle}>
  //       <Text style={{fontSize: 30}}>{item.title}</Text>
  //       <Text>{item.text}</Text>
  //     </View>
  //   );
  // }

  function handleNextScreen() {}

  return (
    <>
      <View
        style={styles.container}>
          <View style={styles.topBar}>
            <Text>
              This is a test
            </Text>
          </View>
          
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 80,
    borderBottomColor: 'red',
    borderBottomWidth: 2,
    marginBottom: 30,
  }
});

export default App;
