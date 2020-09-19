import React from 'react';
import {Navigation} from 'react-native-navigation';

import Init from './screens/Init';
import Setup from './screens/Setup1';
import Signup from './screens/Signup';
import Master from './screens/Master';
import Google from './screens/Google';
import HomeScreen from './screens/HomeScreen';
import BeamScreen from './screens/BeamScreen';
import Theme from './screens/Theme';
import Settings from './screens/Settings';
import CreateCredential from './screens/CreateScreens/CreateCredential';
import AsyncStorage from '@react-native-community/async-storage';
import {THEME_MODE} from './screens/Globals/AsyncStorageEnum';
import THEME_DATA from './screens/Globals/ThemeData';
import {updateThemeMode, updateDatabaseManager} from './screens/Globals/Functions';
import CreateSelector from './screens/Overlays/CreateSelector';

import {NavigationProvider} from 'react-native-navigation-hooks';

Navigation.registerComponent(
  'com.mk0er.Init',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Init {...props} />
      </NavigationProvider>
    );
  },
  () => Init,
);

Navigation.registerComponent(
  'com.mk0er.Signup',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Signup {...props} />
      </NavigationProvider>
    );
  },
  () => Signup,
);

Navigation.registerComponent(
  'com.mk0er.Setup1',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Setup {...props} />
      </NavigationProvider>
    );
  },
  () => Setup,
);

Navigation.registerComponent(
  'com.mk1er.Master',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Master {...props} />
      </NavigationProvider>
    );
  },
  () => Master,
);

Navigation.registerComponent(
  'com.mk1er.Google',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Google {...props} />
      </NavigationProvider>
    );
  },
  () => Google,
);

Navigation.registerComponent(
  'com.mk1er.HomeScreen',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <HomeScreen {...props} />
      </NavigationProvider>
    );
  },
  () => HomeScreen,
);

Navigation.registerComponent(
  'com.mk1er.BeamScreen',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <BeamScreen {...props} />
      </NavigationProvider>
    );
  },
  () => BeamScreen,
);

Navigation.registerComponent(
  'com.mk1er.Theme',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Theme {...props} />
      </NavigationProvider>
    );
  },
  () => Theme,
);

Navigation.registerComponent(
  'com.mk1er.Settings',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <Settings {...props} />
      </NavigationProvider>
    );
  },
  () => Settings,
);

Navigation.registerComponent(
  'com.mk2er.CreateSelector',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <CreateSelector {...props} />
      </NavigationProvider>
    );
  },
  () => CreateSelector,
);

Navigation.registerComponent(
  'com.mk2er.CreateCredential',
  () => (props) => {
    return (
      <NavigationProvider value={{componentId: props.componentId}}>
        <CreateCredential {...props} />
      </NavigationProvider>
    );
  },
  () => CreateCredential,
);

Navigation.events().registerBottomTabSelectedListener(
  ({selectedTabIndex, unselectedTabIndex}) => {
    if (selectedTabIndex == 1) {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                id: 'com.mk1er.BeamScreen',
                name: 'com.mk1er.BeamScreen',
                options: {
                  topBar: {
                    title: {
                      text: 'Beam Screen',
                    },
                  },
                },
              },
            },
          ],
        },
      });
    }
  },
);

Navigation.events().registerModalDismissedListener(({componentName}) => {
  if (componentName === 'com.mk1er.BeamScreen') {
    Navigation.mergeOptions('com.mk1er', {
      bottomTabs: {
        currentTabIndex: 0,
      },
    });
  }
});

let promise = new Promise(async function (resolve, reject) {
  await updateThemeMode();
  await updateDatabaseManager();
  resolve();
});

Navigation.events().registerAppLaunchedListener(() => {
  promise.then((result) => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'com.mk1er.Theme',
                options: {
                  statusBar: {
                    visible: true,
                  },
                  topBar: {
                    visible: 'false',
                  },
                },
              },
            },
          ],
        },
      },
    });
  });
});
