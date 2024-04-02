/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView} from 'react-native';

import {StyledSafeAreaView} from '../../../styles/container';

import HomeHeader from '../../atoms/home-header';
import MainMapCommuter from '../../atoms/main-map-commuter';
import MainRideCommuter from '../../atoms/main-ride-commuter';

import GetLocation from 'react-native-get-location';

import firestore from '@react-native-firebase/firestore';

import notifee from '@notifee/react-native';

// @ts-ignore
function CommuterMain({
  navigation,
  isLoggedIn,
  userUID,
  driverUID,
  redirect,
  setRedirect,
  setProfile,
  setRiderProfile,
  setBookingUID,
  setCommuterUID,
  setDisabledLogout,
}: any) {
  useEffect(() => {
    setCommuterUID(userUID);
  }, [userUID]);

  useEffect(() => {
    const updateLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000,
      })
        .then(location => {
          setPosition({
            latitude: location.latitude,
            longitude: location.longitude * -1,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        })
        .catch(error => {
          const {message} = error;
        });
    };

    updateLocation();

    const intervalId = setInterval(updateLocation, 1000); // Set your desired interval here (in milliseconds)

    return () => clearInterval(intervalId);
  }, []);

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [driverData, setDriverData] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  const isInitialRender = useRef(true);
  const [hasRequest, setHasRequest] = useState(false);
  const [hasRide, setHasRide] = useState(false);
  const [hasDrop, setHasDrop] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);

  const [endStep, setEndStep] = useState(1);
  const [rating, setRating] = useState(0);

  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setDriverData([]);
      setRouteData(null);
      setPriceData(null);

      setHasRequest(false);
      setHasRide(false);
      setHasDrop(false);
      setHasApproved(false);

      setEndStep(1);
      setRating(0);

      setIntervalId(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (redirect) {
      // @ts-ignore
      scrollViewRef.current.scrollToEnd({animated: true});
      // Reset the redirect state to false after scrolling
      setRedirect(false);
    }
  }, [redirect]);

  const scrollViewRef = React.createRef();

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

  const handleCancel = async () => {
    try {
      const driverRef = firestore().collection('Bookings').doc(driverUID);
      const commuterRef = firestore().collection('Users').doc(userUID);

      await driverRef.update({
        // bookerUID: '',
        bookerProfile: {},
        bookingRequest: false,
      });

      await commuterRef.update({
        bookingRequest: false,
      });

      await notifee.displayNotification({
        title: 'Driver Booking Request',
        body: 'You cancelled your request.',
      });
      setHasCancelled(true);

      await updateProfile();
      navigation.navigate('BookingsDetail');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDropoff = async () => {
    try {
      const driverRef = firestore().collection('Bookings').doc(driverUID);
      const commuterRef = firestore().collection('Users').doc(userUID);

      await driverRef.update({
        bookingDropoff: true,
        dropoffUID: userUID,
      });

      await commuterRef.update({
        bookingDropoff: true,
      });

      await updateProfile();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleEnd = async () => {
    try {
      const driverRef = firestore().collection('Users').doc(driverUID);
      const driverSnapshot = await firestore()
        .collection('Users')
        .doc(driverUID)
        .get();
      const commuterRef = firestore().collection('Users').doc(userUID);

      // @ts-ignore
      const currentTotalRides = driverSnapshot.data().totalRides || 0;
      const newTotalRides = currentTotalRides + 1;
      // @ts-ignore
      const currentScore = driverSnapshot.data().score || 0;
      const newScore = currentScore + rating;
      // @ts-ignore
      const newDriverRating = newScore / newTotalRides;

      await driverRef.update({
        score: newScore,
        rating: newDriverRating,
        totalRides: newTotalRides,
      });

      await commuterRef.update({
        dropoffApproved: false,
        bookingOngoing: false,
      });

      await updateProfile();

      setHasRequest(false);
      setHasRide(false);
      setRating(0);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const getRequest = async () => {
    try {
      setHasCancelled(false);
      const bookingsRef = firestore().collection('Bookings').doc(driverUID);
      const bookingsSnapshot = await bookingsRef.get();
      const driverRef = firestore().collection('Users').doc(driverUID);
      const driverSnapshot = await driverRef.get();
      const docRef = firestore().collection('Users').doc(userUID);
      const docSnapshot = await docRef.get();

      if (driverSnapshot.exists) {
        const data = driverSnapshot.data();

        // @ts-ignore
        setDriverData(data);
      }

      if (bookingsSnapshot.exists) {
        const data = bookingsSnapshot.data();

        setPriceData(data?.price);
      }

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
          // @ts-ignore
          setRouteData(data.route);

          setHasRide(true);
          setBookingUID(driverUID);
          setDisabledLogout(true);
          // @ts-ignore
          clearInterval(intervalId);
        } else {
          setDisabledLogout(false);
          setHasRide(false);
        }

        // @ts-ignore
        if (data.bookingDropoff) {
          setHasDrop(true);
          // @ts-ignore
          clearInterval(intervalId);
        } else {
          setHasDrop(false);
        }

        // @ts-ignore
        if (data.dropoffApproved) {
          setHasApproved(true);
          // @ts-ignore
          clearInterval(intervalId);
        } else {
          setHasApproved(false);
        }
      } else {
        console.log('Document does not exist');
        // Do something when the document does not exist
      }
    } catch (error) {
      // console.error('Error checking listing:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const id = setInterval(() => {
        getRequest();
      }, 1000);
      // @ts-ignore
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [hasRequest, hasRide, hasDrop]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const cancelNotification = async () => {
      await notifee.displayNotification({
        title: 'Driver Booking Request',
        body: 'The driver cancelled your request.',
      });
    };

    const rideNotification = async () => {
      await notifee.displayNotification({
        title: 'Driver Booking Accepted',
        body: 'You now have an ongoing ride.',
      });
    };

    const approveNotification = async () => {
      await notifee.displayNotification({
        title: 'Dropoff Request Accepted',
        body: 'Your dropoff request has been approved.',
      });
    };

    if (!hasRequest && hasRide && hasApproved) {
      approveNotification();
    } else if (
      hasRide &&
      !hasRequest &&
      !hasCancelled &&
      hasDrop &&
      !hasApproved
    ) {
      rideNotification();
    } else if (
      !hasRequest &&
      !hasCancelled &&
      !hasRide &&
      isInitialRender.current
    ) {
      cancelNotification();
    }
  }, [hasRequest, hasRide, hasDrop, hasApproved, hasCancelled]);

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Journey'}
        main={true}
        fromProfile={false}
      />
      <ScrollView
        // @ts-ignore
        ref={scrollViewRef}
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
        <MainMapCommuter
          position={position}
          hasRide={hasRide}
          routeData={routeData}
        />
        <MainRideCommuter
          navigation={navigation}
          driverData={driverData}
          routeData={routeData}
          priceData={priceData}
          hasRide={hasRide}
          hasRequest={hasRequest}
          hasDrop={hasDrop}
          hasApproved={hasApproved}
          handleCancel={handleCancel}
          handleDropoff={handleDropoff}
          handleEnd={handleEnd}
          rating={rating}
          setRating={setRating}
          endStep={endStep}
          setEndStep={setEndStep}
        />
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default CommuterMain;
