import {PRIMARY, PRIMARY_LIGHT, GRAY, WHITE, TITLE_BLACK} from './Colors';

const THEME_DATA = {
  C_THEME_MODE: 'light',
  UPDATED: false,
  BUTTONS: {
    BUTTON1: {
      btn: {
        width: '70%',
        borderColor: 'white',
        borderWidth: 1,
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 10,
      },
      d_btn: {
        width: '70%',
        borderColor: 'white',
        borderWidth: 1,
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 10,
      },
      text: {
        textAlign: 'center',
        color: PRIMARY_LIGHT,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
      d_text: {
        textAlign: 'center',
        color: PRIMARY_LIGHT,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
    },
    BUTTON2: {
      btn: {
        width: '70%',
        borderColor: 'white',
        borderWidth: 2.3,
        padding: 12,
        borderRadius: 15,
      },
      d_btn: {
        width: '70%',
        borderColor: 'white',
        borderWidth: 2.3,
        padding: 12,
        borderRadius: 15,
      },
      text: {
        textAlign: 'center',
        color: WHITE,
        fontFamily: 'Poppins-ExtraBold',
        fontSize: 15,
      },
      d_text: {
        textAlign: 'center',
        color: WHITE,
        fontFamily: 'Poppins-ExtraBold',
        fontSize: 15,
      },
    },
    BUTTON3: {
      btn: {
        width: '70%',
        borderColor: PRIMARY,
        borderWidth: 2.3,
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 10,
      },
      d_btn: {
        width: '70%',
        borderColor: PRIMARY,
        borderWidth: 2.3,
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 10,
      },
      text: {
        textAlign: 'center',
        color: PRIMARY,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
      d_text: {
        textAlign: 'center',
        color: PRIMARY,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
    },
    BUTTON4: {
      btn: {
        width: '70%',
        borderColor: PRIMARY,
        borderWidth: 2.3,
        padding: 15,
        backgroundColor: PRIMARY,
        borderRadius: 10,
      },
      d_btn: {
        width: '70%',
        borderColor: PRIMARY,
        borderWidth: 2.3,
        padding: 15,
        backgroundColor: 'transparent',
        borderRadius: 10,
      },
      text: {
        textAlign: 'center',
        color: WHITE,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
      d_text: {
        textAlign: 'center',
        color: PRIMARY,
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
    },
    BUTTON5: {
      btn: {
        width: '70%',
        padding: 0,
        borderRadius: 10,
      },
      text: {
        textAlign: 'center',
        color: '#a0a0a0',
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
      d_btn: {
        width: '70%',
        padding: 0,
        borderRadius: 10,
      },
      d_text: {
        textAlign: 'center',
        color: '#a0a0a0',
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
      },
    },
    BUTTON6: {
      btn: {
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
      },
      d_btn: {
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
      },
    },
  },
  OVERLAY: {
    HEADINGS: {
      HEADING1: {
        text: {
          fontFamily: 'Poppins-Bold',
          fontSize: 20,
          color: TITLE_BLACK,
          textAlign: 'center',
          padding: 15,
        },
        d_text: {
          fontFamily: 'Poppins-Bold',
          fontSize: 20,
          color: WHITE,
          textAlign: 'center',
          padding: 15,
        },
      },
    },
    INFO: {
      INFO1: {
        text: {
          textAlign: 'center',
          fontFamily: 'Poppins-Bold',
          fontSize: 8,
          color: GRAY,
          marginTop: 10,
        },
        d_text: {
          textAlign: 'center',
          fontFamily: 'Poppins-Bold',
          fontSize: 8,
          color: GRAY,
          marginTop: 10,
        },
      },
    },
  },
};

export default THEME_DATA;
