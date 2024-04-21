/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import {Image, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {StyledCol, StyledRow} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';
import Refresh from '../../../assets/icons/refresh.svg';
import Back from '../../../assets/icons/back.svg';

import ButtonNeutral from '../button-neutral';
import ButtonNegative from '../button-negative';
import ButtonPositive from '../button-positive';
import BookingCardLower from '../booking-card-lower';
import BookingCardRider from '../booking-card-rider';

// @ts-ignore
import AnimatedEllipsis from 'react-native-animated-ellipsis';
// @ts-ignore
import StarRating from 'react-native-star-rating-widget';
import { TouchableOpacity } from 'react-native-gesture-handler';

function MainRideCommuter({
  userUID,
  driverUID,
  navigation,
  driverData,
  routeData,
  priceData,
  hasRequest,
  hasRide,
  hasDrop,
  hasApproved,
  handleCancel,
  handleDropoff,
  handleEnd,
  rating,
  setRating,
}: any) {
  
 
  const sans = styledText();

  const handleChat = () => {
    navigation.navigate('RideChat');
  };
  

  const [userData, setUserData] = useState(null);
  const [userPoints, setUserPoints] = useState(0); // State to hold user points
  const [paymentMethod, setPaymentMethod] = useState(''); // Default to cash payment
  const [pointsInput, setPointsInput] = useState('');
  const [driverDatas, setDriverData] = useState(null);
  const [driverPoints, setDriverPoints] = useState(0); // State to hold user points

  const resetPaymentMethod = () => {
    setPaymentMethod('');
    console.log('reset');
  };
  
  const fetchUserDataAndPoints = async () => {
    try {
      const userDoc = await firestore().collection('Users').doc(userUID).get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
        const points = userDoc.data().points || 0;
        setUserPoints(points);
        console.log('User points updated:', points);
      }
    } catch (error) {
      console.error('Error fetching user data and points:', error);
    }
  };
  
  const fetchDriverDataAndPoints = async () => {
    try {
      const userDoc = await firestore().collection('Users').doc(userUID).get();
      const driverDoc = await firestore().collection('Users').doc(userDoc.data().currentDriver).get();
      if (driverDoc.exists) {
        setDriverData(driverDoc.data());
        const points = driverDoc.data().points || 0;
        setDriverPoints(points);
        console.log(userDoc.data().currentDriver);
        console.log('Driver points updated:', points);
      } else {
        console.log('Driver document does not exist');
      }
    } catch (error) {
      console.error('Error fetching driver data and points:', error);
    }
  };
  
  useEffect(() => {
    // Initial fetch
    fetchUserDataAndPoints();
    fetchDriverDataAndPoints();
  
    // Interval for auto-refresh every 60 seconds (adjust as needed)
    const interval = setInterval(() => {
      fetchUserDataAndPoints();
      fetchDriverDataAndPoints();
    }, 6000);
  
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

    const handleRefresh = async () => {
      try {
     
        const userDoc = await firestore().collection('Users').doc(userUID).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
          setUserPoints(userDoc.data().points || 0);
        }
        const driverDoc = await firestore().collection('Users').doc(driverUID).get();
        if (driverDoc.exists) {
          setDriverData(driverDoc.data());
          setDriverPoints(driverDoc.data().points || 0);
        }
        console.log('Points refreshed');
      } catch (error) {
        console.error('Error refreshing points:', error);
      }
    };
    const handleBack = () => {
      setPaymentMethod('');
    };
  
    const handlePointsPayment = async () => {
      try {
        const pointsToPay = parseInt(pointsInput, 10);
        if (isNaN(pointsToPay) || pointsToPay <= 0) {
          // Invalid points input
          Alert.alert('Please enter a valid number of points to transfer.');
          return;
        }
    
        if (pointsToPay > userPoints) {
          // Insufficient points
          Alert.alert('Insufficient points. Please enter a lower amount or choose cash payment.');
          return;
        }
    
        const updatedUserPoints = userPoints - pointsToPay;
        const updatedDriverPoints = driverPoints + pointsToPay;
    
        const userRef = firestore().collection('Users').doc(userUID);
        const driverRef = firestore().collection('Users').doc(driverUID);
    
        // Use batched writes to update both user and driver points atomically
        const batch = firestore().batch();
        batch.update(userRef, { points: updatedUserPoints });
        batch.update(driverRef, { points: updatedDriverPoints });
    
        await batch.commit(); // Commit the batched writes
    
        setPaymentMethod('cash');
        console.log('set to cash');
        setUserPoints(updatedUserPoints); // Update state with new user points
        setDriverPoints(updatedDriverPoints); // Update state with new driver points
      } catch (error) {
        console.error('Error processing points payment:', error);
      }
    };



  return (
    <StyledCol
      style={{
        justifyContent: hasRequest ? 'space-between' : 'center',
        width: '85%',
        height: 'auto',
        minHeight: hasRequest ? 200 : 150,
        marginTop: 25,
        marginBottom: 110,
        paddingTop: 12.5,
        paddingBottom: 12.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}>
      <StyledCol style={{width: '100%', marginTop: hasRequest ? 15 : 0}}>
        {!hasRequest && !hasRide && (
          <>
            <SabeLogo width={75} height={75} />
            <StyledRow>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                You have no ongoing ride
              </StyledText18>
            </StyledRow>
          </>
        )}
        {!hasRequest && hasRide && (
          <StyledCol style={{width: '100%'}}>
            {!hasDrop && !hasApproved && (
              <StyledCol style={{width: '100%'}}>
                <SabeLogo width={75} height={75} />
                <StyledText18
                  style={[
                    sans.bold,
                    {color: '#042F40', marginTop: 5, marginBottom: 10},
                  ]}>
                  Ride Ongoing
                </StyledText18>
                <ButtonPositive onClick={handleChat} text={'Ride Chat'} />
                {driverData && (
                  <StyledCol style={{width: '100%', marginTop: 10}}>
                    <BookingCardRider profile={driverData} />
                  </StyledCol>
                )}
                {routeData && priceData && (
                  <StyledCol style={{width: '100%', marginTop: 10}}>
                    <BookingCardLower routes={routeData} prices={priceData} />
                  </StyledCol>
                )}
                <StyledRow style={{marginTop: 10}}>
                  <ButtonNegative
                    onClick={handleDropoff}
                    text={'Request Dropoff'}
                  />
                </StyledRow>
              </StyledCol>
            )}
            {hasDrop && (
              <>
                <SabeLogo width={75} height={75} />
                <StyledRow style={{marginTop: 10}}>
                  <ButtonNeutral text={'Reviewing Request'} />
                </StyledRow>
              </>
            )}
           {hasApproved && (
  <>
    
    {paymentMethod === 'cash' ? (
      <>
    
        <StyledText18
          style={[
            sans.bold,
            {color: '#042F40', marginTop: 5, marginBottom: 10},
          ]}>
          Rate your driver!
        </StyledText18>
        <StarRating
           onRatingEnd={() => {
            handleEnd();
            resetPaymentMethod(); // This will set paymentMethod to null after handleEnd
          }}
          enableSwiping={true}
          enableHalfStar={false}
          rating={rating}
          onChange={setRating}
          color={'#FFB800'}
        
        />
      </>
    ) : paymentMethod === 'points' ? (
      <>
      <View>
          <TouchableOpacity onPress={handleBack}>
          <Back width={50} height={35}/>
          </TouchableOpacity>
        <StyledText18 style={[sans.bold, { color: '#042F40', marginTop: 5, marginBottom: 10 }]}>
          Available Points: {userPoints}  <TouchableOpacity onPress={handleRefresh}>
          <Refresh width={25} height={25}/>
        </TouchableOpacity>
        </StyledText18>
       
      </View>
        <StyledText18 style={[sans.bold, { color: '#042F40', marginTop: 10 }]}>
          Enter Points to Transfer:
        </StyledText18>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 10 }}
          onChangeText={text => setPointsInput(text)}
          value={pointsInput}
          keyboardType="numeric"
        />
        <ButtonPositive onClick={handlePointsPayment} text={'Pay'} />
      </>
    ) : ( 
      <>
      <View>
        <StyledText18 style={[sans.bold, { color: '#042F40', marginTop: 5, marginBottom: 10 }]}>
          Available Points: {userPoints}  <TouchableOpacity onPress={handleRefresh}>
          <Refresh width={25} height={25}/>
        </TouchableOpacity>
        </StyledText18>
       
      </View>
      <StyledText18 style={[sans.bold, { color: '#042F40', marginTop: 5, marginBottom: 10 }]}>
        Payment Method:
      </StyledText18>
      <ButtonPositive
          onClick={() => setPaymentMethod('cash')}
          text={'Pay Cash'}
          style={{
            justifyContent: 'center', // Center text vertically
            alignItems: 'center', // Center text horizontally
          }}
        />
        <ButtonPositive
          onClick={() => setPaymentMethod('points')}
          text={'Pay Points'}
          style={{
            justifyContent: 'center', // Center text vertically
            alignItems: 'center', // Center text horizontally
          }}
        />
      
    </>
    )}
  </>
)}
          </StyledCol>
        )}
        {!hasRide && hasRequest && (
          <StyledCol>
            {driverData.profPic ? (
              <Image
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#042f40',
                }}
                source={{uri: driverData.profPic}}
              />
            ) : (
              <SabeLogo width={75} height={75} />
            )}
            <StyledRow>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                Booking has been requested!

                Current status: Requested
              </StyledText18>
              {/* <AnimatedEllipsis
                style={{
                  color: '#042F40',
                  fontSize: 26,
                  letterSpacing: -2.5,
                }}
              /> */}
            </StyledRow>
            <StyledRow style={{marginTop: 20}}>
              <ButtonNegative onClick={handleCancel} text={'Cancel Request'} />
            </StyledRow>
          </StyledCol>
        )}
      </StyledCol>
    </StyledCol>
  );
}

export default MainRideCommuter;
