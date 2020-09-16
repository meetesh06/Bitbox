import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App: () => React$Node = () => {


  return (
    <>
      <LinearGradient colors={['#3977de', '#0a938e']} style={styles.linearGradient}>
        <Text style={styles.buttonText}>
          Sign Up
        </Text>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  button1: {
    width: '70%',
    borderColor: 'white',
    borderWidth: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default App;
