import React, {useEffect, useState} from 'react';
import {Dimensions, Image, RefreshControl, ScrollView} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledSafeAreaView,
  StyledTouchableCol,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText18} from '../../../styles/text';

import ModalInfo from '../../atoms/modal-info';
import HomeHeader from '../../atoms/home-header';
import ButtonSettings from '../../atoms/button-settings';
import StatisticsUsers from '../../atoms/statistics-users';

// @ts-ignore
import Person from '../../../assets/icons/person.svg';
// @ts-ignore
import Edit from '../../../assets/icons/edit.svg';

import {launchImageLibrary} from 'react-native-image-picker';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

function AdminProfile({
  navigation,
  setIsLoggedIn,
  userUID,
  profile,
  refetchProfile,
  setDrivers,
  fetchDrivers,
  setCommuters,
  fetchCommuters,
}: any) {
  const sans = styledText();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchProfile();
      // @ts-ignore
      fetchDrivers().then(data => setDrivers(data));
      // @ts-ignore
      fetchCommuters().then(data => setCommuters(data));
      fetchTotalDrivers();
      fetchTotalCommuters();
      setRefreshing(false);
    }, 2000);
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleAboutModalOpen = () => {
    setAboutModalVisible(prevState => !prevState);
  };

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

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    setIsLoggedIn(false);
    navigation.navigate('AuthStack');
  };

  // Firebase
  const [driversTotal, setDriversTotal] = useState(0);
  const [driversUnverified, setDriversUnverified] = useState(0);
  const [driversVerified, setDriversVerified] = useState(0);

  const fetchTotalDrivers = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('type', '==', 'driver')
        .get();

      const docs = querySnapshot.docs;
      // const docIds = docs.map(doc => doc.id);

      const unverifiedCount = docs.filter(doc => !doc.data().isVerified).length;
      const verifiedCount = docs.filter(doc => doc.data().isVerified).length;
      const totalDrivers = unverifiedCount + verifiedCount;

      setDriversUnverified(unverifiedCount);
      setDriversVerified(verifiedCount);
      setDriversTotal(totalDrivers);
    } catch (error) {
      console.error('Error fetching commuters: ', error);
    }
  };

  const [commutersTotal, setCommutersTotal] = useState(0);
  const [commutersUnverified, setCommutersUnverified] = useState(0);
  const [commutersVerified, setCommutersVerified] = useState(0);

  const fetchTotalCommuters = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('type', '==', 'commuter')
        .get();

      const docs = querySnapshot.docs;
      // const docIds = docs.map(doc => doc.id);

      const unverifiedCount = docs.filter(doc => !doc.data().isVerified).length;
      const verifiedCount = docs.filter(doc => doc.data().isVerified).length;
      const totalCommuters = unverifiedCount + verifiedCount;

      setCommutersUnverified(unverifiedCount);
      setCommutersVerified(verifiedCount);
      setCommutersTotal(totalCommuters);
    } catch (error) {
      console.error('Error fetching commuters: ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // @ts-ignore
      await fetchTotalDrivers();
      await fetchTotalCommuters();
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [userUID]);

  return (
    <>
      <StyledSafeAreaView
        style={{
          justifyContent: 'flex-start',
          backgroundColor: '#042F40',
        }}>
        <HomeHeader
          navigation={navigation}
          title={'Admin Profile'}
          main={true}
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
              justifyContent: 'space-between',
              width: '100%',
              height: Dimensions.get('window').height * 0.7,
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
            </StyledCol>
            <StyledCol>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
                Statistics
              </StyledText18>
              <StyledRow
                style={{
                  justifyContent: 'space-between',
                  width: '85%',
                }}>
                <StatisticsUsers
                  type={'Drivers'}
                  total={driversTotal}
                  verified={driversVerified}
                  unverified={driversUnverified}
                />
                <StatisticsUsers
                  type={'Commuters'}
                  total={commutersTotal}
                  verified={commutersVerified}
                  unverified={commutersUnverified}
                />
              </StyledRow>
            </StyledCol>
            <StyledCol style={{width: '100%', marginTop: 10}}>
              <ButtonSettings
                setting={'About Us'}
                onClick={handleAboutModalOpen}
              />
              <ButtonSettings setting={'Sign Out'} onClick={handleLogout} />
            </StyledCol>
          </StyledCol>
        </ScrollView>
      </StyledSafeAreaView>
      <ModalInfo
        visible={aboutModalVisible}
        setVisible={setAboutModalVisible}
        section={'About Us'}
      />
    </>
  );
}

export default AdminProfile;
