/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_CONTAINER} from '../Globals/Colors';

const App: () => React$Node = () => {
  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: darkThemeColor(B_CONTAINER),
        }}>
        <Text>Create Credential</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
