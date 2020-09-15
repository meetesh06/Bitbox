import {Navigation} from 'react-native-navigation';
import App from './screens/Init';

Navigation.registerComponent('com.mk0er.Init', () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.mk0er.Init',
            },
          },
        ],
      },
    },
  });
});
