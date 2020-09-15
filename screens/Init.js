import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text} from 'react-native';
import AnimatedLinearGradient, {
  presetColors,
} from 'react-native-animated-linear-gradient';

const App: () => React$Node = () => {
  return (
    <>
      <AnimatedLinearGradient customColors={gradientStyles.bitbox} speed={8000}>
        <View
          style={{
            flex: 1,
          }}
        />

        <View style={styles.textContainer}>
          <Text style={styles.bigHeader}>Hello.</Text>
          <Text style={styles.bigSubHeader}>Secure Encrypt Store</Text>
        </View>

        <View
          style={{
            flex: 1,
          }}
        />
      </AnimatedLinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  bigHeader: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 30,
    textAlign: 'center',
    color: '#fff',
  },
  bigSubHeader: {
    fontFamily: 'Poppins-Thin',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
});

const gradientStyles = {
  bitbox: ['rgb(57, 119, 222)', 'rgb(10, 147, 142)', 'rgb(29, 52, 134)'],
};

export default App;
