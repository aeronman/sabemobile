import React, {useState} from 'react';

import {useNetInfo} from '@react-native-community/netinfo';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Loading from '../../molecules/loading';
import ChatRide from '../../molecules/chat-ride';
import ChatBookings from '../../molecules/chat-bookings';
import DriverMessages from '../../molecules/driver-messages';
import BookingsDetail from '../../molecules/bookings-detail';
import FallbackInternet from '../../molecules/fallback-internet';
import FallbackUnverified from '../../molecules/fallback-unverified';

import AuthStack from '../2-auth_stack';
import HomeStack from '../3-home_stack';
import AdminStack from '../4-admin_stack';

import firestore from '@react-native-firebase/firestore';

function MainStack() {
  const netInfo = useNetInfo();

  const Stack = createStackNavigator();

  // Global
  const [userUID, setUserUID] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState([]);

  // UIDs
  const [commuterUID, setCommuterUID] = useState('');
  const [driverUID, setDriverUID] = useState('');
  const [bookingUID, setBookingUID] = useState('');

  // Commuter Hooks
  const [riderProfile, setRiderProfile] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const refetchProfile = async () => {
    try {
      const userDocument = await firestore()
        .collection('Users')
        .doc(userUID)
        .get();

      if (userDocument.exists) {
        const userData = userDocument.data();
        // @ts-ignore
        setProfile(userData);
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error Fetching Profile');
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}>
        <Stack.Screen name="Loading">
          {props => (
            <Loading
              {...props}
              setUserUID={setUserUID}
              setIsLoggedIn={setIsLoggedIn}
              setProfile={setProfile}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AuthStack">
          {() => (
            <AuthStack
              setProfile={setProfile}
              setUserUID={setUserUID}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="HomeStack">
          {props =>
            // @ts-ignore
            !netInfo.isConnected ? (
              <FallbackInternet />
            ) : // @ts-ignore
            profile.isVerified && isLoggedIn ? (
              <HomeStack
                {...props}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                userUID={userUID}
                driverUID={driverUID}
                redirect={redirect}
                setRedirect={setRedirect}
                profile={profile}
                setProfile={setProfile}
                refetchProfile={refetchProfile}
                setDriverUID={setDriverUID}
                riderProfile={riderProfile}
                setRiderProfile={setRiderProfile}
                setBookingUID={setBookingUID}
                setCommuterUID={setCommuterUID}
              />
            ) : (
              <FallbackUnverified {...props} />
            )
          }
        </Stack.Screen>
        <Stack.Screen name="AdminStack">
          {props =>
            // @ts-ignore
            !netInfo.isConnected ? (
              <FallbackInternet />
            ) : (
              <AdminStack
                {...props}
                setIsLoggedIn={setIsLoggedIn}
                userUID={userUID}
                profile={profile}
                refetchProfile={refetchProfile}
              />
            )
          }
        </Stack.Screen>
        <Stack.Screen name="BookingsDetail">
          {props => (
            <BookingsDetail
              {...props}
              setRedirect={setRedirect}
              userUID={userUID}
              profile={profile}
              setProfile={setProfile}
              driverUID={driverUID}
              riderProfile={riderProfile}
              setRiderProfile={setRiderProfile}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="DriverMessage">
          {props => (
            <DriverMessages
              {...props}
              userUID={userUID}
              setCommuterUID={setCommuterUID}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="BookingsChat">
          {props => (
            <ChatBookings
              {...props}
              userUID={userUID}
              commuterUID={commuterUID}
              driverUID={driverUID}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RideChat">
          {props => (
            <ChatRide
              {...props}
              userUID={userUID}
              driverUID={driverUID}
              bookingUID={bookingUID}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStack;
