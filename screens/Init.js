import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native';
import AnimatedLinearGradient, {
  presetColors,
} from 'react-native-animated-linear-gradient';

const App: () => React$Node = () => {
  return (
    <>
      <AnimatedLinearGradient
        customColors={gradientStyles.bitbox}
        speed={4000}>
        <Text>SLIM STHAT</Text>
      </AnimatedLinearGradient>
    </>
  );
};

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: '#fff',
//   },
// });

const gradientStyles = {
  bitbox: [
    'rgb(57, 119, 222)',
    'rgb(10, 147, 142)',
    'rgb(29, 52, 134)'
  ]
};

export default App;
