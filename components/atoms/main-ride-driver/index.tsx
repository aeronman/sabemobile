import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';

import {StyledCol, StyledRow} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';
import {alertEmergencyStop} from '../../../utils/alerts.ts';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';

// @ts-ignore
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import ButtonAccept from '../button-accept';
import ButtonReject from '../button-reject';
import ButtonNegative from '../button-negative';
import ButtonPositive from '../button-positive';
import ListingTwo from '../listing-two';
import ListingOne from '../listing-one';
import BookingCardLower from '../booking-card-lower';
import BookingCardPassengers from '../booking-card-passengers';

import firestore from '@react-native-firebase/firestore';
import StarRating from 'react-native-star-rating-widget';

function MainRideDriver({
  navigation,
  routeData,
  userUID,
  hasListing,
  setHasListing,
  priceData,
  requesteeData,
  setRequesteeData,
  dropeeData,
  setDropeeData,
  passengersData,
  hasRequest,
  setHasRequest,
  hasRide,
  setHasRide,
  hasDrop,
  setHasDrop,
  hasApproved,
  setHasApproved,
  rating,
  setRating,
}: any) {
  const sans = styledText();

  const [dropStep, setDropStep] = useState(1);

  const [profiles, setProfiles] = useState([]);

  const handleReject = async (index: any) => {
    try {
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();
  
      if (!driverSnapshot.exists) {
        console.error('Document does not exist.');
        return;
      }
  
      const driverData = driverSnapshot.data();
  
      if (!driverData || !driverData.bookerUID || !driverData.bookerProfile) {
        console.error('Missing required data in document.');
        return;
      }
      
      const commuterRef = firestore().collection('Users').doc(driverData.bookerUID[index]);
      await commuterRef.update({
        bookingRequest: false,
      });
  
      const currentBookerProfile = driverData.bookerProfile;
      const updatedBookerProfile = [...currentBookerProfile];
      updatedBookerProfile.splice(index, 1);
  
      const currentBookerUID = driverData.bookerUID;
      const updatedBookerUID = [...currentBookerUID];
      updatedBookerUID.splice(index, 1);
  
      if (currentBookerUID.length == 0) {
        await driverRef.update({
          bookerUID: updatedBookerUID,
          bookerProfile: updatedBookerProfile,
          bookingRequest: false,
        });
      } else {
        await driverRef.update({
          bookerUID: updatedBookerUID,
          bookerProfile: updatedBookerProfile,
        });
      }
  
  
      // setHasRequest(false);
      // setRequesteeData([]);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleAccept = async (index:any) => {
    try {
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();
      const commuterRef = firestore()
        .collection('Users')
        .doc(driverSnapshot.data().bookerUID[index]);

      // @ts-ignore
      const currentRoute = driverSnapshot.data().route;
      // @ts-ignore
      const currentPassengerCount = driverSnapshot.data().passengerCount || 0;
      const newPassengerCount = currentPassengerCount + 1;

      const currentBookerProfile = driverSnapshot.data().bookerProfile;
      const updatedBookerProfile = [...currentBookerProfile];
      updatedBookerProfile.splice(index, 1)

      const currentBookerUID = driverSnapshot.data().bookerUID;
      const updatedBookerUID = [...currentBookerUID];
      updatedBookerUID.splice(index,1)

      if(currentBookerUID.length == 0){
      await driverRef.update({
        bookingPassengers: firestore.FieldValue.arrayUnion(
          driverSnapshot.data().bookerUID[index],
        ),
        bookerUID: updatedBookerUID,
        bookerProfile: updatedBookerProfile,
        bookingRequest: false,
        bookingOngoing: true,
        passengerCount: newPassengerCount,
        // @ts-ignore
       
      });
    }
    else{
      await driverRef.update({
        bookingPassengers: firestore.FieldValue.arrayUnion(
          driverSnapshot.data().bookerUID[index],
        ),
        bookerUID: updatedBookerUID,
        bookerProfile: updatedBookerProfile,
        bookingOngoing: true,
        passengerCount: newPassengerCount,
        // @ts-ignore
       
      });

    }

      await commuterRef.update({
        bookingRequest: false,
        bookingOngoing: true,
        route: currentRoute,
        currentDriver : userUID,
      });

      // setHasRequest(false);
      setHasRide(true);
      // setRequesteeData([]);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleViewDrop = async () => {
    try {
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();
      const commuterSnapshot = await firestore()
        .collection('Users')
        .doc(driverSnapshot.data().dropoffUID)
        .get();

      setDropeeData(commuterSnapshot.data());
      setDropStep(2);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleCancelDrop = async () => {
    try {
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();
      const commuterRef = firestore()
        .collection('Users')
        .doc(driverSnapshot.data().dropoffUID);

      await driverRef.update({
        bookingDropoff: false,
        dropoffUID: '',
      });

      await commuterRef.update({
        bookingDropoff: false,
      });

      setDropStep(1);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleAcceptDrop = async () => {
    try {
      handleSave();
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();

      const userRef = firestore().collection('Users').doc(userUID);
      const userSnapshot = await userRef.get();
      // @ts-ignore
      const messageIDs = userSnapshot.data().chatID;

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

        // Assuming userRef is a reference to the user's document
        await userRef.update({
          chatID: [],
        });
      }

      const commuterRef = firestore()
        .collection('Users')
        .doc(driverSnapshot.data().dropoffUID);

      const updatedPassengers = driverSnapshot
        .data()
        .bookingPassengers.filter(
          passenger => passenger !== driverSnapshot.data().dropoffUID,
        );
      
      await driverRef.update({
        bookingDropoff: false,
        dropoffApproved: true,
        bookingPassengers: updatedPassengers,
      });

      await commuterRef.update({
        bookingDropoff: false,
        dropoffApproved: true,
        route: [],
      });

      setHasDrop(false);
      setHasApproved(true);
      setRating(0);
      setDropStep(1);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleCheckPassengers = async () => {
    try {
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();

      const currentPassengerCount = driverSnapshot.data().passengerCount || 0;

      if (currentPassengerCount === 0) {
      
        setTimeout(async () => {

          handleDelete();
        }, 2000);
      }
    } catch (error) {
      console.log('Error checking passengers');
    }
  };

  const handleEnd = async () => {
    try {
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();
      const commuterRef = firestore()
        .collection('Users')
        .doc(driverSnapshot.data().dropoffUID);
      const commuterSnapshot = await firestore()
        .collection('Users')
        .doc(driverSnapshot.data().dropoffUID)
        .get();

      // @ts-ignore
      const currentPassengerCount = driverSnapshot.data().passengerCount || 0;
      const newPassengerCount = currentPassengerCount - 1;

      await driverRef.update({
        passengerCount: newPassengerCount,
        bookingOngoing: newPassengerCount !== 0,
        dropoffUID: '',
        dropoffApproved: false,
      });

      // @ts-ignore
      const currentCommuterTotalRides = commuterSnapshot.data().totalRides || 0;
      const newCommuterTotalRides = currentCommuterTotalRides + 1;
      // @ts-ignore
      const currentScore = commuterSnapshot.data().score || 0;
      const newScore = currentScore + rating;
      // @ts-ignore
      const newCommuterRating = newScore / newCommuterTotalRides;

      await commuterRef.update({
        score: newScore,
        rating: newCommuterRating,
        totalRides: newCommuterTotalRides,
      });

      await handleCheckPassengers();

      setHasDrop(false);
      setHasApproved(false);
      setRating(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const profilesRef = firestore().collection('Users');

      // @ts-ignore
      const profilesPromises = passengersData.map(async uid => {
        const profileDoc = await profilesRef.doc(uid).get();
        return profileDoc.data();
      });

      const profiles = await Promise.all(profilesPromises);
      // @ts-ignore
      setProfiles(profiles);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    if (passengersData && passengersData.length > 0) {
      fetchProfiles();
    }
  }, [passengersData]);

  const handleChat = () => {
    navigation.navigate('RideChat');
  };

  const handleStop = () => {
    alertEmergencyStop(stopRide);
  };

  const stopRide = async () => {
    try {
      // @ts-ignore
      const driverRef = firestore().collection('Bookings').doc(userUID);
      const driverSnapshot = await firestore()
        .collection('Bookings')
        .doc(userUID)
        .get();

      let totalPassengers;
      if (driverSnapshot.exists) {
        const data = driverSnapshot.data();
        // @ts-ignore
        const bookingUIDs = data.bookingPassengers;
        totalPassengers = bookingUIDs.length;

        for (let i = 0; i < bookingUIDs.length; i++) {
          const currentUserUID = bookingUIDs[i];

          const commuterRef = firestore()
            .collection('Users')
            .doc(currentUserUID);

          await commuterRef.update({
            dropoffApproved: false,
            bookingOngoing: false,
            route: [],
          });
        }

        // @ts-ignore
        const currentPassengerCount = driverSnapshot.data().passengerCount || 0;
        const newPassengerCount = currentPassengerCount - totalPassengers;
        handleSave();
        await driverRef.update({
          bookingPassengers: [],
          passengerCount: newPassengerCount,
          bookingOngoing: false,
          dropoffUID: '',
          dropoffApproved: false,
        });
       
        setTimeout(async () => {
        
          handleDelete();
        }, 2000);
      }
    } catch (error) {
      console.log('Error stopping ride: ', error);
    }
  };
  const handleSave = async () => {
    try {
      console.log('Attempting to save booking data...');
      // Get the current booking data
      const bookingRef = firestore().collection('Bookings').doc(userUID);
      const bookingSnapshot = await bookingRef.get();
      const bookingData = bookingSnapshot.data();
  
      // Create a new collection called 'BookingHistory'
      const bookingHistoryRef = firestore().collection('BookingHistory').doc();
  
      // Save the booking data along with the current booking document ID as 'driverid' in 'BookingHistory'
      await bookingHistoryRef.set({
        driverid: bookingRef.id, // Use the booking document ID instead of userUID
        bookingData: bookingData,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
  
      console.log('Booking data saved to BookingHistory');
    } catch (error) {
      console.error('Error saving booking data to BookingHistory:', error);
    }
  };

  const handleDelete = async () => {
    try {
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
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  

  return (
    <StyledCol
      style={{
        justifyContent: 'center',
        width: '85%',
        height: 'auto',
        minHeight: 150,
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
      <StyledCol style={{width: '100%', marginTop: 0}}>
  
           
          
        {hasRide && (  
        
        <StyledCol style={{ width: '100%' }}>
        
          
              {!hasDrop && !hasApproved && (

                
                <StyledCol style={{ width: '100%' }}>
                  <SabeLogo width={75} height={75} />
                  <StyledText18
                    style={[
                      sans.bold,
                      { color: '#042F40', marginTop: 5, marginBottom: 10 },
                    ]}>
                    Ride Ongoing
                  </StyledText18>
                  <ButtonPositive onClick={handleChat} text={'Ride Chat'} />
                  {profiles.length > 0 && (
                    <StyledCol
                      style={{
                        width: '100%',
                        marginTop: 10,
                      }}>
                      <BookingCardPassengers profiles={profiles} />
                    </StyledCol>
                  )}
                  {routeData && priceData && (
                    <StyledCol style={{ width: '100%', marginTop: 10 }}>
                      <BookingCardLower routes={routeData} prices={priceData} />
                    </StyledCol>
                  )}
                  <ButtonNegative onClick={handleStop} text={'Emergency Stop'} />
                </StyledCol>
                
              )}
              {hasDrop && (
                <>
                  {dropeeData.profPic ? (
                    <Image
                      style={{
                        width: 75,
                        height: 75,
                        marginTop: 10,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: '#042f40',
                      }}
                      source={{ uri: dropeeData.profPic }} />
                  ) : (
                    <SabeLogo width={75} height={75} />
                  )}
                  <StyledRow>
                    <StyledText18
                      style={[sans.bold, { color: '#042F40', marginTop: 5 }]}>
                      Requesting Dropoff
                    </StyledText18>
                    <AnimatedEllipsis
                      style={{
                        color: '#042F40',
                        fontSize: 26,
                        letterSpacing: -2.5,
                      }} />
                  </StyledRow>
                  {dropStep === 1 ? (
                    <StyledRow style={{ marginTop: 10 }}>
                      <ButtonPositive
                        onClick={handleViewDrop}
                        text={'View Request'} />
                    </StyledRow>
                  ) : (
                    <>
                      <ListingOne label={'Email'} data={dropeeData.email} />
                      <ListingTwo
                        labelOne={'Name'}
                        dataOne={dropeeData.name}
                        labelTwo={'Contact'}
                        dataTwo={dropeeData.contact} />
                      <ListingTwo
                        labelOne={'Type'}
                        dataOne={dropeeData.type}
                        labelTwo={'Rating'}
                        dataTwo={dropeeData.rating
                          ? dropeeData.rating.toFixed(2)
                          : dropeeData.rating} />
                      <StyledRow style={{ marginTop: 10 }}>
                        <ButtonReject onClick={handleCancelDrop} />
                        <ButtonAccept onClick={handleAcceptDrop} />
                      </StyledRow>
                    </>
                  )}
                </>
              )}
              {hasApproved && (
                <>
                  <StyledText18
                    style={[
                      sans.bold,
                      { color: '#042F40', marginTop: 5, marginBottom: 10 },
                    ]}>
                    Rate your passenger!
                  </StyledText18>
                  <StarRating
                    onRatingEnd={handleEnd}
                    enableSwiping={true}
                    enableHalfStar={false}
                    rating={rating}
                    onChange={setRating}
                    color={'#FFB800'} />
                </>
              )}
            </StyledCol>
        )}
        {hasRequest && (
         <StyledCol>
         {requesteeData.map((requestee:any, index:any) => (
           <StyledCol key={index}>
             {/* <Image
               style={{
                 width: 75,
                 height: 75,
                 marginTop: 10,
                 borderRadius: 50,
                 borderWidth: 2,
                 borderColor: '#042f40',
               }}
               source={{ uri: requestee.profPic }}
             />
             <StyledRow>
               <StyledText18 style={[sans.bold, { color: '#042F40', marginTop: 5 }]}>
                 Commuter requesting
               </StyledText18>
               <AnimatedEllipsis
                 style={{
                   color: '#042F40',
                   fontSize: 26,
                   letterSpacing: -2.5,
                 }}
               />
             </StyledRow> */} 
             <ListingOne label={'Email'} data={requestee.email} />
             <ListingTwo
               labelOne={'Name'}
               dataOne={requestee.name}
               labelTwo={'Contact'}
               dataTwo={requestee.contact}
             />
             <ListingTwo
               labelOne={'Type'}
               dataOne={requestee.type} 
               labelTwo={'Rating'}
               dataTwo={requestee.rating ? requestee.rating.toFixed(2) : requestee.rating}
             />
             <StyledRow style={{ marginTop: 10 }}>
             <ButtonReject onClick={() => handleReject(index)} />
                <ButtonAccept onClick={() => handleAccept(index)} />
             </StyledRow>
           </StyledCol>
         ))}
          </StyledCol>
        )}
        {!hasRide && (!hasRequest || requesteeData.length === 0) && (
          <StyledCol>
            <SabeLogo width={75} height={75} />
            <StyledRow>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                {hasListing
                  ? "Waiting for commuter's request"
                  : 'You have no active listing'}
              </StyledText18>
              {hasListing && (
                <AnimatedEllipsis
                  style={{
                    color: '#042F40',
                    fontSize: 26,
                    letterSpacing: -2.5,
                  }}
                />
              )}
            </StyledRow>
          </StyledCol>
        )}
      </StyledCol>
    </StyledCol>
  );
}

export default MainRideDriver;
