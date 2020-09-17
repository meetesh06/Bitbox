import React, {useContext, useRef, useEffect} from 'react';
import {
  Text,
  Button,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {NavigationContext} from 'react-native-navigation-hooks';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Alert() {
  const {componentId} = useContext(NavigationContext);
  
  const top = useRef(new Animated.Value(windowHeight)).current;
  function dismiss() {
    Animated.timing(top, {
      toValue: windowHeight,
      duration: 300,
    }).start(() => Navigation.dismissOverlay(componentId));
    // Navigation.dismissOverlay(componentId);
  }

  useEffect(() => {
    Animated.timing(top, {
      toValue: windowHeight / 2,
      duration: 300,
    }).start();
  }, [top]);

  return (
    <>
      <View>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.outsideTouch}>

          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={{...styles.root, top}} useNativeDriver={true} />
      </View>
    </>
  );
}

const styles = {
  root: {
    backgroundColor: '#fff',
    height: windowHeight / 2,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  outsideTouch: {
    height: windowHeight,
    width: windowWidth,
  }
};

Alert.options = (props) => {
  return {
    overlay: {
      interceptTouchOutside: true,
    },
  };
};

module.exports = Alert;
