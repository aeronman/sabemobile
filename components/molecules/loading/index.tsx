import React, {useEffect} from 'react';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText, StyledText60} from '../../../styles/text';

// @ts-ignore
import HomeLogo from '../../../assets/icons/home.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore
function Loading({navigation, setUserUID, setIsLoggedIn, setProfile}: any) {
  const sans = styledText();

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const auth = JSON.parse((await AsyncStorage.getItem('auth')) as string);
      const data = JSON.parse((await AsyncStorage.getItem('data')) as string);

      console.log(uid);
      console.log(auth);
      console.log(data);

      if (uid !== null && auth !== null && data.isVerified) {
        setUserUID(uid);
        setIsLoggedIn(auth);
        setProfile(data);
        navigation.navigate('HomeStack');
      } else {
        navigation.navigate('AuthStack');
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StyledSafeAreaView style={{backgroundColor: '#03314B'}}>
      <StyledCol>
        <HomeLogo width={75} height={75} />
      </StyledCol>
      <StyledCol style={{paddingBottom: 50}}>
        <StyledText60 style={[sans.bold, {color: '#f3f3f3'}]}>
          Sabe
        </StyledText60>
      </StyledCol>
    </StyledSafeAreaView>
  );
}

export default Loading;
