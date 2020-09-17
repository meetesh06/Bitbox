import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import THEME_DATA from '../Globals/ThemeData';
import {darkThemeColor, updateThemeMode} from '../Globals/Functions';
import {PRIMARY, B_BOTTOMNAV, GRAY} from '../Globals/Colors';

const layouts: Promise<Layouts> = new Promise((resolve) => {
  Promise.all([
    FontAwesomeIcon.getImageSource('home', 25),
    FontAwesomeIcon.getImageSource('bolt', 25),
    FontAwesomeIcon.getImageSource('pencil', 15),
    FontAwesomeIcon.getImageSource('credit-card-alt', 13),
    FontAwesomeIcon.getImageSource('bank', 13),
    FontAwesomeIcon.getImageSource('user', 13),
    updateThemeMode(),
  ]).then((icons) => {
    resolve({
      bottomTabs: {
        id: 'com.mk1er',
        children: [
          {
            stack: {
              id: 'com.mk1er.homeTab',
              children: [
                {
                  component: {
                    id: 'com.mk1er.HomeScreen',
                    name: 'com.mk1er.HomeScreen',
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: icons[0],
                  iconColor: GRAY,
                  selectedIconColor: PRIMARY,
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
          {
            stack: {
              id: 'com.mk1er.beamTab',
              children: [
                {
                  component: {
                    id: 'com.mk1er.BeamScreen',
                    name: 'com.mk1er.BeamScreen',
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: icons[1],
                  iconColor: GRAY,
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
          {
            stack: {
              id: 'com.mk1er.Settings',
              children: [
                {
                  component: {
                    id: 'com.mk1er.BeamScreen',
                    name: 'com.mk1er.BeamScreen',
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: icons[5],
                  iconColor: GRAY,
                  selectedIconColor: PRIMARY,
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
        ],
        options: {
          bottomTabs: {
            animate: true,
            titleDisplayMode: 'alwaysHide',
            backgroundColor: darkThemeColor(B_BOTTOMNAV),
          },
          topBar: {
            visible: false,
          },
          animations: {
            push: {
              content: {
                alpha: {
                  from: 0,
                  to: 1,
                  duration: 200,
                },
              },
            },
            pop: {
              content: {
                alpha: {
                  from: 1,
                  to: 0,
                  duration: 100,
                },
              },
            },
          },
        },
      },
    });
  });
});

export function goToHome(navIntent) {
  layouts.then((result) => {
    console.log(result);
    navIntent(result);
  });
}
