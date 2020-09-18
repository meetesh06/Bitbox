import React from 'react';
import {
  StyleSheet,
  TextInput,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_INPUT_BACK, B_INPUT_TEXT} from '../Globals/Colors';

const App: () => React$Node = ({placeholder, value, updater}) => {
  return (
    <TextInput
      style={{
        ...styles.inputContainer,
        color: darkThemeColor(B_INPUT_TEXT),
        backgroundColor: darkThemeColor(B_INPUT_BACK),
      }}
      onChangeText={(text) => updater(text)}
      value={value}
      placeholderTextColor={darkThemeColor(B_INPUT_TEXT)}
      multiline={true}
      numberOfLines={4}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});

export default App;
