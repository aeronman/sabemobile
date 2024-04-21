import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledTouchableRow,
} from '../../../styles/container';
import {
  styledText,
  StyledText12,
  StyledText14,
  StyledText18,
  StyledText24,
} from '../../../styles/text';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import RatingLogo from '../../../assets/icons/rating.svg';
// @ts-ignore
import ArrowRight from '../../../assets/icons/arrow-right.svg';
// @ts-ignore
import CapacityLogo from '../../../assets/icons/capacity.svg';
// @ts-ignore
import ChatLogo from '../../../assets/icons/chat-bookings.svg';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function BookingsCard({
  navigation,
  profile,
  riderId,
  riderData,
  setDriverUID,
  setRiderProfile,
}: any) {
  const sans = styledText();

  const [image, setImage] = useState('');
  const [rating, setRating] = useState(0);
  const [totalRides, setTotalRides] = useState(0);

  const [intervalId, setIntervalId] = useState(null);

  const chatRider = () => {
    if (!profile.bookingRequest) {
      setDriverUID(riderId);
      setRiderProfile(riderData);
    }
    navigation.navigate('BookingsChat');
  };

  const pickRider = () => {
    if ((profile.bookingRequest)) {
      setDriverUID(riderId);
      setRiderProfile(riderData);
    } 
    else if (profile.bookingRequest === false){
      setDriverUID(riderId);
      setRiderProfile(riderData);
    }
    
    navigation.navigate('BookingsDetail');
  };

  const getUpdatedProfile = async () => {
    try {
      const driverSnapshot = await firestore()
        .collection('Users')
        .doc(riderId)
        .get();

      // @ts-ignore
      setImage(driverSnapshot.data().profPic);
      // @ts-ignore
      setRating(driverSnapshot.data().rating);
      // @ts-ignore
      setTotalRides(driverSnapshot.data().totalRides);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      getUpdatedProfile();
    }, 1000);
    // @ts-ignore
    setIntervalId(id);
    return () => clearInterval(id);
  }, [riderId]);

  return (
    <StyledCol
      style={{
        justifyContent: 'space-between',
        width: '85%',
        minWidth: 200,
        height: 'auto',
        marginTop: 25,
        marginBottom: 5,
        paddingTop: 12.5,
        paddingBottom: 12.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}>
      <StyledRow
        style={{
          width: '87.5%',
          justifyContent: 'space-between',
        }}>
        <StyledRow>
          {image ? (
            <Image
              style={{
                width: 30,
                height: 30,
                borderWidth: 2,
                borderRadius: 50,
                borderColor: '#042f40',
              }}
              source={{uri: image}}
            />
          ) : (
            <SabeLogo width={32.5} height={32.5} />
          )}
          <StyledCol
            style={{
              paddingLeft: 10,
            }}>
            <StyledText14
              style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
              {riderData.name}
            </StyledText14>
            <StyledText12
              style={[
                sans.regular,
                {color: '#1FBF83', alignSelf: 'flex-start'},
              ]}>
              {riderData.carMake + ' ' + riderData.carSeries} (
              {riderData.carColor})
            </StyledText12>
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledText24 style={[sans.bold, {color: '#042F40'}]}>
            PHP {riderData.fare}
          </StyledText24>
        </StyledRow>
      </StyledRow>

      <StyledRow
        style={{
          width: '87.5%',
          justifyContent: 'space-evenly',
          marginTop: 5,
          marginBottom: 5,
        }}>
        <StyledRow>
          <RatingLogo width={25} height={25} />
          <StyledText14
            style={[
              sans.regular,
              {color: '#9D9D9D', paddingLeft: 2.5, paddingTop: 2},
            ]}>
            {rating.toFixed(2)}
          </StyledText14>
          <StyledText14
            style={[
              sans.regular,
              {color: '#9D9D9D', paddingLeft: 2.5, paddingTop: 2},
            ]}>
            ( {totalRides} )
          </StyledText14>
        </StyledRow>
        <StyledRow style={{paddingTop: 2}}>
          <CapacityLogo width={20} height={20} />
          <StyledText14
            style={[
              sans.regular,
              {color: '#9D9D9D', paddingLeft: 2.5, paddingTop: 2},
            ]}>
            {riderData.passengerCount} / {riderData.passengerLimit}
          </StyledText14>
        </StyledRow>
      </StyledRow>

      <StyledRow
        style={{justifyContent: 'flex-start', width: '87.5%', marginBottom: 5}}>
        <StyledText18 style={[sans.bold, {color: '#042F40'}]}>
          {riderData.date}
        </StyledText18>
      </StyledRow>

      <StyledRow
        style={{
          width: '87.5%',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}>
        <StyledCol style={{width: '50%'}}>
          <StyledText12
            style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
            {riderData.timeStart}
          </StyledText12>
          <StyledText14
            style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
            {riderData.route[0]}
          </StyledText14>
        </StyledCol>
        <StyledCol style={{width: '50%'}}>
          <StyledText12
            style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-end'}]}>
            {riderData.timeEnd}
          </StyledText12>
          <StyledText14
            style={[sans.bold, {color: '#042F40', alignSelf: 'flex-end'}]}>
            {riderData.route[riderData.route.length - 1]}
          </StyledText14>
        </StyledCol>
      </StyledRow>

      <StyledRow
        style={{
          justifyContent: 'space-between',
          width: '87.5%',
          paddingTop: 5,
          borderTopWidth: 1,
          borderColor: '#c7c7c7',
        }}>
        {/* <StyledTouchableRow style={{paddingTop: 2.5}} onPress={chatRider}>
          <StyledText14
            style={[
              sans.bold,
              {color: '#042F40', paddingTop: 2, marginRight: 2.5},
            ]}>
            MESSAGE
          </StyledText14>
          <ChatLogo width={20} height={20} />
        </StyledTouchableRow> */}
        <StyledTouchableRow style={{paddingTop: 2.5}} onPress={pickRider}>
          <StyledText14 style={[sans.bold, {color: '#042F40', paddingTop: 2}]}>
            VIEW DETAILS
          </StyledText14>
          <ArrowRight width={25} height={25} />
        </StyledTouchableRow>
      </StyledRow>
    </StyledCol>
  );
}

export default BookingsCard;
