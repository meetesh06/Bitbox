import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  // Dimensions,
} from 'react-native';
import {darkThemeColor} from '../Globals/Functions';
import {B_TOPBAR_TITLE, CP_LOADING, CP_CREATE} from '../Globals/Colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import CredentialCard from '../Components/CredentialCard';

const App: () => React$Node = ({
  title,
  elements,
  elementContentKey,
  handler,
  sectionHandler,
  newHandler,
  style,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={sectionHandler}
        disabled={loading || elements.length === 0}
        style={styles.sectionHeaderContainer}>
        <Text
          style={{
            ...styles.sectionHeaderText,
            color: darkThemeColor(B_TOPBAR_TITLE),
          }}>
          {title}
        </Text>
        {!loading && elements.length !== 0 && (
          <FontAwesomeIcon
            style={styles.sectionHeaderIcon}
            name="folder-open"
            size={18}
            color={darkThemeColor(B_TOPBAR_TITLE)}
          />
        )}
        {loading && (
          <ActivityIndicator
            size="small"
            color={darkThemeColor(B_TOPBAR_TITLE)}
            style={styles.sectionHeaderIcon}
          />
        )}
      </TouchableOpacity>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {!loading &&
          elements &&
          elements.map((element) => {
            return (
              <TouchableOpacity
                key={element.id}
                onPress={() => handler(element)}>
                <CredentialCard
                  id={element.id}
                  title={element.title}
                  content={element[elementContentKey]}
                  style={style}
                  horizontalList
                  colors={JSON.parse(element.themeData).colorData}
                />
              </TouchableOpacity>
            );
          })}
        {!loading && elements.length === 0 && (
          <TouchableOpacity onPress={() => newHandler(title)}>
            <CredentialCard
              id={'nil'}
              title={'+'}
              content={''}
              style={style}
              horizontalList
              create
              colors={CP_CREATE}
            />
          </TouchableOpacity>
        )}
        {loading &&
          [1, 2, 3, 4].map((ele) => {
            return (
              <CredentialCard
                key={ele}
                id={'nil'}
                title={'LOADING'}
                content={''}
                style={style}
                horizontalList
                loading
                colors={CP_LOADING}
              />
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  sectionHeaderIcon: {
    paddingLeft: 10,
    top: -2,
  },
});

export default App;
