/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_HIGHLIGHT} from '../Globals/Colors';
import LinearGradient from 'react-native-linear-gradient';

const App: () => React$Node = ({selectedUpdate, colors}) => {
  const [picked, setPicked] = useState(0);
  function updateColor(element, index) {
    setPicked(index);
    selectedUpdate(element);
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        {colors.map((element, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.element}
              onPress={() => {
                updateColor(element, index);
              }}>
              <LinearGradient
                colors={element.colorData}
                style={{
                  ...styles.elementGradient,
                  borderColor: darkThemeColor(B_HIGHLIGHT),
                  borderWidth: picked === index ? 1.5 : 0,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  element: {
    margin: 5,
  },
  elementGradient: {
    width: 25,
    height: 25,
    borderRadius: 7,
  },
});

export default App;
