import React, {useEffect} from 'react';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText, StyledText16, StyledText60} from '../../../styles/text';

import auth from '@react-native-firebase/auth';

// @ts-ignore
import HomeLogoDark from '../../../assets/icons/home-dark.svg';

// @ts-ignore
function FallbackUnverified({navigation}) {
  const sans = styledText();

  useEffect(() => {
    const timer = setTimeout(() => {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));

      navigation.navigate('AuthStack');
      // navigation.navigate('HomeStack');
    }, 5000);

    // Clear the timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <StyledSafeAreaView style={{backgroundColor: '#f3f3f3'}}>
      <StyledCol>
        <HomeLogoDark width={75} height={75} />
      </StyledCol>
      <StyledCol style={{paddingBottom: 50}}>
        <StyledText60 style={[sans.bold, {color: '#03314B'}]}>
          Sabe
        </StyledText60>
      </StyledCol>
      <StyledCol>
        <StyledText16 style={[sans.regular, {color: '#03314B'}]}>
          🚧 Ongoing Verification. Try Again. 🚧
        </StyledText16>
      </StyledCol>
    </StyledSafeAreaView>
  );
}

export default FallbackUnverified;
