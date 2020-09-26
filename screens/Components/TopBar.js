import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_TOPBAR_TITLE, PRIMARY} from '../Globals/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Navigation} from 'react-native-navigation';
import {useNavigation} from 'react-native-navigation-hooks';

const App: () => React$Node = ({title, context, backCallback}) => {
  const {pop} = useNavigation();
  return (
    <>
      <View style={styles.container}>
        {context && (
          <TouchableOpacity
            style={styles.btnContaner}
            onPress={() => Navigation.dismissModal(context)}>
            <FontAwesomeIcon
              style={styles.btn}
              name="chevron-left"
              size={20}
              color={darkThemeColor(B_TOPBAR_TITLE)}
            />
          </TouchableOpacity>
        )}
        {backCallback !== undefined && (
          <TouchableOpacity style={styles.btnContaner} onPress={backCallback}>
            <FontAwesomeIcon
              style={styles.btn}
              name="chevron-left"
              size={20}
              color={darkThemeColor(B_TOPBAR_TITLE)}
            />
          </TouchableOpacity>
        )}
        <Text
          style={{
            ...styles.title,
            color: darkThemeColor(B_TOPBAR_TITLE),
          }}>
          {title}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderColor: PRIMARY,
    borderBottomWidth: 2,
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnContaner: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  btn: {
    paddingRight: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    top: 2,
    fontSize: 20,
  },
});

export default App;
