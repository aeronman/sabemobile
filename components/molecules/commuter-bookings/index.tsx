import React, {useEffect, useState} from 'react';
import {Dimensions, RefreshControl, ScrollView} from 'react-native';

import {
  StyledSafeAreaView,
  StyledPlaceholder,
  StyledCol,
} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';

import HomeHeader from '../../atoms/home-header';
import BookingsCard from '../../atoms/bookings-card';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
import Sabe from '../../../assets/icons/home-dark.svg';

// @ts-ignore
function CommuterBookings({
  navigation,
  userUID,
  profile,
  setDriverUID,
  setRiderProfile,
}: any) {
  const sans = styledText();

  const [refreshing, setRefreshing] = React.useState(false);

  const [riders, setRiders] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // @ts-ignore
    setTimeout(() => {
      // @ts-ignore
      getBookings().then(data => setRiders(data));
      setRefreshing(false);
    }, 1000);

    // Set up interval to fetch data every second
    const intervalId = setInterval(() => {
      // @ts-ignore
      getBookings().then(data => setRiders(data));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getBookings = async () => {
    try {
      const usersCollection = await firestore().collection('Bookings').get();
      const allUsers = usersCollection.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));

      return allUsers;
    } catch (error) {
      console.error('Error fetching users: ', error);
      return [];
    }
  };

  useEffect(() => {
    // @ts-ignore
    getBookings().then(data => setRiders(data));

    const intervalId = setInterval(() => {
      // @ts-ignore
      getBookings().then(data => setRiders(data));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userUID]);

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Bookings'}
        main={true}
        fromProfile={false}
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
        {riders.length > 0 ? (
          riders.map((rider, index) => (
            <BookingsCard
              key={index}
              navigation={navigation}
              profile={profile}
              // @ts-ignore
              riderId={rider.id}
              // @ts-ignore
              riderData={rider.data}
              setDriverUID={setDriverUID}
              setRiderProfile={setRiderProfile}
            />
          ))
        ) : (
          <StyledCol style={{marginTop: 50}}>
            <Sabe width={100} height={100} />
            <StyledText18
              style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
              No Available Rides
            </StyledText18>
          </StyledCol>
        )}
        <StyledPlaceholder />
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default CommuterBookings;
