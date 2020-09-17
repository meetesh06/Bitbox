/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from './Globals/Functions';
import {B_CONTAINER} from './Globals/Colors';

const App: () => React$Node = () => {
  return (
    <>
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
        <Text>Create Screen</Text>
      </ScrollView>
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
