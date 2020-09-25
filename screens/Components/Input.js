import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_INPUT_BACK, B_INPUT_TEXT} from '../Globals/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Kohana} from 'react-native-textinput-effects';

const App: () => React$Node = ({
  title,
  icon,
  value,
  updater,
  secure = false,
  keyboardType = 'default',
  error = false,
  style = {},
}) => {
  return (
    <Kohana
      style={{
        ...styles.inputContainer,
        backgroundColor: darkThemeColor(B_INPUT_BACK),
        borderColor: 'red',
        borderWidth: error ? 2 : 0,
        ...style
      }}
      label={title}
      iconClass={FontAwesomeIcon}
      iconName={icon}
      iconColor={darkThemeColor(B_INPUT_TEXT)}
      inputPadding={10}
      labelStyle={{
        color: darkThemeColor(B_INPUT_TEXT), 
        top: -10,
        }}
      inputStyle={{
        color: darkThemeColor(B_INPUT_TEXT),
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      }}
      labelContainerStyle={{
        padding: 12,
      }}
      iconContainerStyle={{padding: 12, left: 0}}
      useNativeDriver
      value={value}
      onChangeText={(text) => updater(text)}
      keyboardType={'default'}
      secureTextEntry={secure}
      iconSize={22}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default App;
