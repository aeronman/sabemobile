/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {Dimensions, Image, RefreshControl, ScrollView} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledSafeAreaView,
  StyledTouchableCol,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText18} from '../../../styles/text';

import HomeHeader from '../../atoms/home-header';
import ModalInfo from '../../atoms/modal-info';
import ButtonSettings from '../../atoms/button-settings';

// @ts-ignore
import Rating from '../../../assets/icons/rating.svg';
// @ts-ignore
import Edit from '../../../assets/icons/edit.svg';
// @ts-ignore
import Person from '../../../assets/icons/person.svg';
// @ts-ignore
import Rides from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import Coin from '../../../assets/icons/coin.svg';

import {openComposer} from 'react-native-email-link';
import {launchImageLibrary} from 'react-native-image-picker';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

function UserProfile({
  navigation,
  setIsLoggedIn,
  userUID,
  profile,
  refetchProfile,
  disableLogout,
}: any) {
  const sans = styledText();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchProfile();
      setRefreshing(false);
      
    }, 2000);
  }, []);

  const [faqModalVisible, setFaqModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleFaqModalOpen = () => {
    setFaqModalVisible(prevState => !prevState);
  };

  const handleAboutModalOpen = () => {
    setAboutModalVisible(prevState => !prevState);
  };

  const handleEmail = () => {
    openComposer({
      to: '2020101221@dhvsu.edu.ph',
      subject: 'Sabe Customer Support',
      body: 'Hi, can you help me with...',
    });
  };

  const [isHovered, setIsHovered] = useState(false);

  // @ts-ignore
  const uploadPicture = async imageUri => {
    try {
      // Upload image to Firebase Storage
      const fileName =
        profile.name + '-' + imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`commuters/${fileName}`);
      const task = storageRef.putFile(imageUri);
      const downloadURL = await task.then(() => storageRef.getDownloadURL());

      const userRef = firestore().collection('Users').doc(userUID);

      await userRef.update({
        profPic: downloadURL,
      });

      refetchProfile();
    } catch (error) {
      console.log('Upload Failed');
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    // @ts-ignore
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        // @ts-ignore
      } else if (response.error) {
        // @ts-ignore
        console.log('Image picker error: ', response.error);
      } else {
        // @ts-ignore
        let imageUri = response.uri || response.assets?.[0]?.uri;
        uploadPicture(imageUri);
      }
    });
  };

  const buyPoints = () => {
    navigation.navigate('buy-points');
  };

  const withdrawPoints = () => {
    navigation.navigate('widthdraw-points');
  };

  return (
    <>
      <StyledSafeAreaView
        style={{
          justifyContent: 'flex-start',
          backgroundColor: '#042F40',
        }}>
        <HomeHeader
          setIsLoggedIn={setIsLoggedIn}
          navigation={navigation}
          title={'Profile'}
          main={true}
          fromProfile={true}
          disableLogout={disableLogout}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: Dimensions.get('window').height * 0.89,
            backgroundColor: '#e7e7e7',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}>
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          <StyledCol
            style={{
              justifyContent: 'space-evenly',
              width: '100%',
              height: 500,
              marginTop: 25,
            }}>
            <StyledCol>
              <StyledTouchableCol
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
                onPressIn={() => setIsHovered(true)}
                onPressOut={() => setIsHovered(false)}
                onPress={openImagePicker}>
                {profile.profPic ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginTop: 5,
                      marginBottom: 5,
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: '#042f40',
                    }}
                    source={{uri: profile.profPic}}
                  />
                ) : (
                  <Person width={50} height={50} />
                )}
                {isHovered && (
                  <Edit width={25} height={25} style={{position: 'absolute'}} />
                )}
              </StyledTouchableCol>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
                {profile.name}
              </StyledText18>
              <StyledText14
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                {profile.contact} | {profile.email}
              </StyledText14>
              <StyledRow>
                <StyledRow style={{marginTop: 10, marginRight: 10}}>
                  <Rides width={30} height={30} />
                  <StyledText18
                    style={[
                      sans.bold,
                      {color: '#042F40', marginLeft: 5, marginTop: 1.5},
                    ]}>
                    {profile.totalRides}
                  </StyledText18>
                </StyledRow>
                <StyledRow style={{marginLeft: 10, marginTop: 10}}>
                  <Rating width={30} height={30} />
                  <StyledText18
                    style={[
                      sans.bold,
                      {color: '#042F40', marginLeft: 5, marginTop: 1.5},
                    ]}>
                    {profile.rating.toFixed(2)}
                  </StyledText18>
                </StyledRow>
                <StyledRow style={{marginLeft: 10, marginTop: 10}}>
                  <Coin width={30} height={30} />
                  <StyledText18
                    style={[
                      sans.bold,
                      {color: '#042F40', marginLeft: 5, marginTop: 1.5},
                    ]}>
                    {profile.points.toFixed(2)}
                  </StyledText18>
                </StyledRow>
              </StyledRow>
            </StyledCol>
            <StyledCol style={{width: '100%', marginTop: 10}}>
            
              {profile.type === 'driver' ? (
                <ButtonSettings
                  setting={'Withdraw Points'}
                  onClick={withdrawPoints}
                />
              ) : (
                <ButtonSettings setting={'Buy Points'} onClick={buyPoints} />
              )}
              <ButtonSettings
                setting={'Frequently Asked Questions'}
                onClick={handleFaqModalOpen}
              />
              <ButtonSettings
                setting={'Contact Support'}
                onClick={handleEmail}
              />
              <ButtonSettings
                setting={'About Us'}
                onClick={handleAboutModalOpen}
              />
              <ButtonSettings
                setting={'Refresh Profile'}
                onClick={onRefresh}
              />
            </StyledCol>
          </StyledCol>
        </ScrollView>
      </StyledSafeAreaView>

      <ModalInfo
        visible={faqModalVisible}
        setVisible={setFaqModalVisible}
        section={'Frequently Asked Questions'}
      />
      <ModalInfo
        visible={aboutModalVisible}
        setVisible={setAboutModalVisible}
        section={'About Us'}
      />
    </>
  );
}

export default UserProfile;
