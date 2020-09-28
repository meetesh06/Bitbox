import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {darkThemeColor} from '../Globals/Functions';
import {PRIMARY, B_BOTTOMNAV, GRAY} from '../Globals/Colors';
import THEME_DATA from '../Globals/ThemeData';

const ANIMATIONS = THEME_DATA.ANIMATIONS;

const layouts: Promise<Layouts> = new Promise((resolve) => {
  Promise.all([
    FontAwesomeIcon.getImageSource('home', 25),
    FontAwesomeIcon.getImageSource('bolt', 25),
    FontAwesomeIcon.getImageSource('pencil', 15),
    FontAwesomeIcon.getImageSource('credit-card-alt', 13),
    FontAwesomeIcon.getImageSource('bank', 13),
    FontAwesomeIcon.getImageSource('user', 13),
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
          },
          topBar: {
            visible: false,
          },
          animations: ANIMATIONS.PP,
        },
      },
    });
  });
});

export function goToHome(navIntent) {
  layouts.then((result) => {
    result.bottomTabs.options.bottomTabs.backgroundColor = darkThemeColor(
      B_BOTTOMNAV,
    );
    console.log(result.bottomTabs.options.bottomTabs);
    navIntent(result);
  });
}
