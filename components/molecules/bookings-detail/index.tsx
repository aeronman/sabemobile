import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';

import HomeHeader from '../../atoms/home-header';
import BookingCard from '../../atoms/booking-card';
import ButtonBooking from '../../atoms/button-booking';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function BookingsDetail({

  navigation,
  setRedirect,
  userUID,
  profile,
  setProfile,
  driverUID,
  riderProfile,
  setRiderProfile,
}: any) {
  const [hasRide, setHasRide] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);

  const [intervalId, setIntervalId] = useState(null);

  const updateProfile = async () => {
    const userDocument = await firestore()
      .collection('Users')
      .doc(userUID)
      .get();
    if (userDocument.exists) {
      const userData = userDocument.data();
      setProfile(userData);
    } else {
      console.log('Document does not exist');
    }
    const riderDocument = await firestore()
      .collection('Bookings')
      .doc(driverUID)
      .get();
    if (riderDocument.exists) {
      const riderData = riderDocument.data();
      setRiderProfile(riderData);
    } else {
      console.log('Document does not exist');
    }
  };

  const sendRequest = async () => {
    try {
      const driverRef = firestore().collection('Bookings').doc(driverUID);
      const commuterRef = firestore().collection('Users').doc(userUID);
      

      
      
      await driverRef.update({
        bookerUID: firestore.FieldValue.arrayUnion(userUID),
        bookerProfile: firestore.FieldValue.arrayUnion(profile),
        bookingRequest: true,
      });
      
      await commuterRef.update({
        bookingRequest: true,
      });

      await updateProfile();
      setRedirect(true);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const getRequest = async () => {
    try {
      const docRef = firestore().collection('Users').doc(userUID);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const data = docSnapshot.data();

        // @ts-ignore
        if (data.bookingRequest) {
          setHasRequest(true);
          // @ts-ignore
          clearInterval(intervalId);
        } else {
          setHasRequest(false);
        }

        // @ts-ignore
        if (data.bookingOngoing) {
          setHasRide(true);
          // @ts-ignore
          clearInterval(intervalId);
        } else {
          setHasRide(false);
        }
      } else {
        console.log('Document does not exist');
        // Do something when the document does not exist
      }
    } catch (error) {
      console.error('Error checking listing:', error);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      getRequest();
      updateProfile();
    }, 1000);
    // @ts-ignore
    setIntervalId(id);
    return () => clearInterval(id);
  }, [hasRequest, hasRide]);

  
  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Booking Detail'}
        main={false}
        fromProfile={false}
      />
      <StyledCol
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: Dimensions.get('window').height * 0.9,
          backgroundColor: '#e7e7e7',
        }}>
        <BookingCard riderProfile={riderProfile} />
        <ButtonBooking
          onClick={sendRequest}
          conditionOne={hasRequest}
          conditionTwo={
            riderProfile.passengerCount === riderProfile.passengerLimit
          }
          conditionThree={hasRide}
        />
      </StyledCol>
    </StyledSafeAreaView>
  );
}

export default BookingsDetail;
