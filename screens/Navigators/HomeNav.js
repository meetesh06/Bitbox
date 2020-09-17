import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const layouts: Promise<Layouts> = new Promise((resolve) => {
  Promise.all([
    FontAwesomeIcon.getImageSource('home', 25),
    FontAwesomeIcon.getImageSource('bolt', 25),
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
