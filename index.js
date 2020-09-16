import React from 'react';
import {Navigation} from 'react-native-navigation';

import Init from './screens/Init';
import Setup from './screens/Setup1';
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
