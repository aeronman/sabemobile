import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList} from 'react-native';

import {StyledSafeAreaView} from '../../../styles/container';
import {
  alertMissingDetails,
  alertDeleteListing,
} from '../../../utils/alerts.ts';

import HomeHeader from '../../atoms/home-header';
import ButtonCreate from '../../atoms/button-create';
import DetailsCardInput from '../../atoms/details-card-input';
import DetailsCardListing from '../../atoms/details-card-listing';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function DriverBookings({
  navigation,
  userUID,
  profile,
  create,
  setCreate,
  hasListing,
  setHasListing,
  booking,
}: any) {
  useEffect(() => {}, [create]);

  const [isLoading, setIsLoading] = useState(false);

  const [pax, setPax] = useState('');
  const [timeStart, setTimeStart] = useState('--:-- --');
  const [timeEnd, setTimeEnd] = useState('--:-- --');
  const [dateJourney, setDateJourney] = useState('--------');
  const [routes, setRoutes] = useState([]);
  const [prices, setPrices] = useState([]);

  const handleCreate = () => {
    // @ts-ignore
    setCreate(prevState => !prevState);
  };

  const handleCancel = () => {
    setPax('');
    setTimeStart('--:-- --');
    setTimeEnd('--:-- --');
    setDateJourney('--------');
    setRoutes([]);
    // @ts-ignore
    setCreate(prevState => !prevState);
  };

  const handleDelete = () => {
    const deleteListing = async () => {
      try {
        setIsLoading(true);
        await firestore().collection('Bookings').doc(userUID).delete();

        const driverRef = firestore().collection('Users').doc(userUID);
        const driverSnapshot = await driverRef.get();
        // @ts-ignore
        const messageIDs = driverSnapshot.data().messageIDs;

        if (messageIDs && messageIDs.length > 0) {
          for (const messageID of messageIDs) {
            const chatId = messageID;

            const messagesRef = firestore()
              .collection('Chats')
              .doc(chatId)
              .collection('messages');

            const querySnapshot = await messagesRef.get();

            querySnapshot.forEach(doc => {
              messagesRef.doc(doc.id).delete();
            });
          }
        }

        await driverRef.update({
          messageIDs: [],
        });

        setHasListing(false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    };

    alertDeleteListing(deleteListing);
  };

  const handleApprove = async () => {
    if (
      pax === '' ||
      timeStart === '--:-- --' ||
      timeEnd === '--:-- --' ||
      dateJourney === '--------' ||
      routes.length === 0
    ) {
      alertMissingDetails();
    } else {
      try {
        setIsLoading(true);
        await firestore()
          .collection('Bookings')
          .doc(userUID)
          .set({
            bookerUID: {},
            bookerProfile: {},
            bookingRequest: false,
            name: profile.name,
            carColor: profile.carColor,
            carMake: profile.carMake,
            carSeries: profile.carSeries,
            carPlate: profile.carPlate,
            contact: profile.contact,
            email: profile.email,
            passengerCount: 0,
            passengerLimit: Number(pax),
            rating: profile.rating,
            totalRides: profile.totalRides,
            route: routes,
            price: prices,
            timeStart: timeStart,
            timeEnd: timeEnd,
            date: dateJourney,
          });
        setIsLoading(false);
        handleCancel();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Listing'}
        main={true}
        fromProfile={false}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        data={create ? [1] : [0]}
        keyExtractor={item => item.toString()}
        renderItem={({item}) =>
          item === 1 ? (
            <DetailsCardInput
              isLoading={isLoading}
              profile={profile}
              onCancel={handleCancel}
              onApprove={handleApprove}
              pax={pax}
              timeStart={timeStart}
              timeEnd={timeEnd}
              dateJourney={dateJourney}
              routes={routes}
              prices={prices}
              setPax={setPax}
              setTimeStart={setTimeStart}
              setTimeEnd={setTimeEnd}
              setDateJourney={setDateJourney}
              setRoutes={setRoutes}
              setPrices={setPrices}
            />
          ) : !hasListing ? (
            <ButtonCreate onClick={handleCreate} />
          ) : (
            <DetailsCardListing
              isLoading={isLoading}
              booking={booking}
              onClick={handleDelete}
            />
          )
        }
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.89,
          backgroundColor: '#e7e7e7',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      />
    </StyledSafeAreaView>
  );
}

export default DriverBookings;
