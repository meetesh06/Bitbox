/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const DISPLAY_WIDTH = Dimensions.get('window').width;
// const DISPLAY_HEIGHT = Dimensions.get('window').height;

const App: () => React$Node = ({
  fullView,
  id,
  title,
  content,
  colors,
  style,
  horizontalList,
}) => {
  return (
    <>
      <View
        style={{
          width: fullView ? DISPLAY_WIDTH : undefined,
          justifyContent: fullView ? 'center' : undefined,
          alignItems: fullView ? 'center' : undefined,
          padding: horizontalList ? 5 : undefined,
        }}>
        <LinearGradient
          colors={colors}
          useAngle={true}
          angle={-18}
          style={{
            ...styles.gradient,
            width: style === 1 ? 240 : style === 2 ? 120 : 120,
            height: style === 1 ? 120 : style === 2 ? 120 : 60,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Poppins-Bold',
                fontSize: style === 1 ? 20 : style === 2 ? 15 : 15,
                color: '#fff',
              }}>
              {title === '' ? 'Card Title' : title}
            </Text>
            {style !== 3 && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: style === 1 ? 14 : style === 2 ? 10 : 10,
                  marginTop: 5,
                  color: '#fff',
                }}>
                {content}
              </Text>
            )}
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}>
            <FontAwesomeIcon
              name="unlock"
              size={style !== 3 ? 18 : 12}
              color={'#fff'}
            />
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default App;
