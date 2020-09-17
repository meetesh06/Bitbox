import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const layouts: Promise<Layouts> = new Promise((resolve) => {
  Promise.all([
    FontAwesomeIcon.getImageSource('home', 25),
    FontAwesomeIcon.getImageSource('bolt', 25),
    FontAwesomeIcon.getImageSource('unlock', 15),
    FontAwesomeIcon.getImageSource('credit-card-alt', 13),
    FontAwesomeIcon.getImageSource('bank', 13),
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
                  selectedIconColor: 'red',
                  iconInsets: {
                    left: 15,
                    right: 15,
                  },
                },
                fab: {
                  id: 'createFAB',
                  backgroundColor: '#3977de',
                  rippleColor: '#2556a8',
                  clickColor: '#2556a8',
                  actions: [
                    {
                      id: 'createPasswords',
                      icon: icons[2],
                      backgroundColor: '#2556a8',
                      iconColor: '#fff',
                      size: 'mini',
                    },
                    {
                      id: 'createCard',
                      icon: icons[3],
                      backgroundColor: '#2556a8',
                      iconColor: '#fff',
                      size: 'mini',
                    },
                    {
                      id: 'Bank',
                      icon: icons[4],
                      backgroundColor: '#2556a8',
                      iconColor: '#fff',
                      size: 'mini',
                    },
                  ],
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
                },
              },
            },
          },
        ],
        options: {
          bottomTabs: {
            animate: false,
            hideOnScroll: true,
            titleDisplayMode: 'alwaysHide',
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
