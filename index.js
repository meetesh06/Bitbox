import React from 'react';
import {Navigation} from 'react-native-navigation';

import Init from './screens/Init';
import Setup from './screens/Setup1';
import Signup from './screens/Signup';
import Master from './screens/Master';
import Google from './screens/Google';

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



Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.mk0er.Google',
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
