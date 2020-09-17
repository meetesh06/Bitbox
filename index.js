import React from 'react';
import {Navigation} from 'react-native-navigation';

import Init from './screens/Init';
import Setup from './screens/Setup1';
import Signup from './screens/Signup';
import Master from './screens/Master';
import Google from './screens/Google';
import HomeScreen from './screens/HomeScreen';
import BeamScreen from './screens/BeamScreen';

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
  'com.mk0er.Master',
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
  'com.mk0er.Google',
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

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.mk0er.Init',
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
