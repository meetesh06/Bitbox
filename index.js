import {Navigation} from 'react-native-navigation';
import Init from './screens/Init';

Navigation.registerComponent('com.mk0er.Init', () => Init);

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
                  visible: 'false',
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
