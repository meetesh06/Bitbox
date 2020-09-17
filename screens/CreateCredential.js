/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from './Globals/Functions';
import {B_CONTAINER} from './Globals/Colors';

const App: () => React$Node = () => {
  return (
    <>
      <View style={styles.container}>
        <Text>Create Credential</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkThemeColor(B_CONTAINER),
  },
});

export default App;
