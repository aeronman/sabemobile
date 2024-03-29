import React from 'react';
import {Dimensions} from 'react-native';

import {
  StyledRow,
  StyledSafeAreaView,
  StyledTouchableRow,
} from '../../../styles/container';
import {styledText, StyledText24} from '../../../styles/text';

// @ts-ignore
import ArrowLeft from '../../../assets/icons/arrow-left.svg';
// @ts-ignore
import Logout from '../../../assets/icons/logout.svg';
// @ts-ignore
import Message from '../../../assets/icons/message-rider.svg';

import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeHeader({
  navigation,
  setIsLoggedIn,
  title,
  main,
  fromProfile,
  disableLogout,
}: any) {
  const sans = styledText();

  const handleBack = () => {
    if (
      title === 'Booking Detail' ||
      title === 'Booking Chat' ||
      title === 'Messages'
    ) {
      navigation.navigate('Bookings');
    } else if (title === 'Ride Chat') {
      navigation.navigate('Home');
    }
  };

  const handleMessage = () => {
    if (title === 'Listing') {
      navigation.navigate('DriverMessage');
    }
  };

  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setIsLoggedIn(false);

    await AsyncStorage.setItem('uid', '');
    await AsyncStorage.setItem('auth', JSON.stringify(false));
    await AsyncStorage.setItem('data', JSON.stringify([]));

    navigation.navigate('AuthStack');
  };

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-end',
        width: '100%',
        height: Dimensions.get('window').height * 0.105,
        backgroundColor: '#042F40',
        zIndex: 2,
      }}>
      <StyledRow
        style={{
          width: '90%',
          justifyContent:
            fromProfile ||
            !main ||
            title === 'Ride Chat' ||
            title === 'Booking Chat' ||
            title === 'Listing' ||
            title === 'Messages'
              ? 'space-between'
              : 'center',
          paddingBottom: 11,
        }}>
        {title === 'Listing' && <StyledRow style={{width: 30, height: 30}} />}
        {(!main ||
          title === 'Ride Chat' ||
          title === 'Booking Chat' ||
          title === 'Messages') && (
          <StyledTouchableRow onPress={handleBack}>
            <ArrowLeft width={30} height={30} />
          </StyledTouchableRow>
        )}
        {fromProfile && <StyledRow style={{width: 30, height: 30}} />}

        <StyledText24 style={[sans.bold, {color: '#fff'}]}>
          {title}
        </StyledText24>

        {(!main ||
          title === 'Ride Chat' ||
          title === 'Booking Chat' ||
          title === 'Messages') && (
          <StyledRow style={{width: 30, height: 30}} />
        )}
        {fromProfile && (
          <StyledTouchableRow onPress={handleLogout} disabled={disableLogout}>
            <Logout width={30} height={30} />
          </StyledTouchableRow>
        )}
        {title === 'Listing' && (
          <StyledTouchableRow onPress={handleMessage}>
            <Message width={30} height={30} />
          </StyledTouchableRow>
        )}
      </StyledRow>
    </StyledSafeAreaView>
  );
}

export default HomeHeader;
