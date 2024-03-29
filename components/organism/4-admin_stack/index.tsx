import React, {useEffect, useState} from 'react';

import {
  AnimatedTabBarNavigator,
  DotSize,
  TabElementDisplayOptions,
} from 'react-native-animated-nav-tab-bar';

import AdminDrivers from '../../molecules/admin-drivers';
import AdminCommuters from '../../molecules/admin-commuters';
import AdminProfile from '../../molecules/admin-profile';

// @ts-ignore
import AdminDriver from '../../../assets/icons/admin-driver.svg';
// @ts-ignore
import AdminDriverAlt from '../../../assets/icons/admin-driver-alt.svg';
// @ts-ignore
import AdminStudent from '../../../assets/icons/admin-student.svg';
// @ts-ignore
import AdminStudentAlt from '../../../assets/icons/admin-student-alt.svg';
// @ts-ignore
import HomeProfile from '../../../assets/icons/home-profile.svg';
// @ts-ignore
import HomeProfileAlt from '../../../assets/icons/home-profile-alt.svg';

import firestore from '@react-native-firebase/firestore';

import notifee from '@notifee/react-native';

function AdminStack({setIsLoggedIn, userUID, profile, refetchProfile}: any) {
  const Tabs = AnimatedTabBarNavigator();

  const [drivers, setDrivers] = useState([]);
  const [commuters, setCommuters] = useState([]);

  const fetchCommuters = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('type', '==', 'commuter')
        .where('isVerified', '==', false)
        .get();

      const docIds = querySnapshot.docs.map(doc => doc.id);

      const commutersDetails = await Promise.all(
        docIds.map(async commuterId => {
          const commuterDoc = await firestore()
            .collection('Users')
            .doc(commuterId)
            .get();

          // @ts-ignore
          if (commuterDoc.data().isNotified === false) {
            await notifee.displayNotification({
              title: 'Commuter Verification Request',
              // @ts-ignore
              body: commuterDoc.data().name + ' is asking for verification.',
            });

            await firestore()
              .collection('Users')
              .doc(commuterId)
              .update({isNotified: true});
          }
          return {id: commuterId, data: commuterDoc.data()};
        }),
      );

      return commutersDetails;
    } catch (error) {
      console.error('Error fetching commuters: ', error);
      return [];
    }
  };

  const fetchDrivers = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Users')
        .where('type', '==', 'driver')
        .where('isVerified', '==', false)
        .get();

      const docIds = querySnapshot.docs.map(doc => doc.id);
      // console.log('Drivers Document IDs: ', docIds);

      const driversDetails = await Promise.all(
        docIds.map(async driverId => {
          const driverDoc = await firestore()
            .collection('Users')
            .doc(driverId)
            .get();

          // @ts-ignore
          if (driverDoc.data().isNotified === false) {
            await notifee.displayNotification({
              title: 'Driver Verification Request',
              // @ts-ignore
              body: driverDoc.data().name + ' is asking for verification.',
            });

            await firestore()
              .collection('Users')
              .doc(driverId)
              .update({isNotified: true});
          }
          return {id: driverId, data: driverDoc.data()};
        }),
      );

      // @ts-ignore
      return driversDetails;
    } catch (error) {
      console.error('Error fetching commuters: ', error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    fetchDrivers().then(data => setDrivers(data));
    // @ts-ignore
    fetchCommuters().then(data => setCommuters(data));
  }, [userUID]);

  return (
    <Tabs.Navigator
      appearance={{
        floating: true,
        shadow: true,
        whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
        whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
        dotSize: DotSize.SMALL,
        tabBarBackground: '#042F40',
        activeTabBackgrounds: '#f3f3f3',
      }}
      initialRouteName={'AdminProfile'}>
      <Tabs.Screen
        name={'Bookings'}
        options={{
          // @ts-ignore
          tabBarIcon: ({focused}) =>
            focused ? (
              <AdminDriver width={27.5} height={27.5} />
            ) : (
              <AdminDriverAlt width={27.5} height={27.5} />
            ),
        }}>
        {props => (
          <AdminDrivers
            {...props}
            drivers={drivers}
            setDrivers={setDrivers}
            fetchDrivers={fetchDrivers}
          />
        )}
      </Tabs.Screen>

      <Tabs.Screen
        name={'AdminProfile'}
        options={{
          // @ts-ignore
          tabBarIcon: ({focused}) =>
            focused ? (
              <HomeProfile width={20} height={20} />
            ) : (
              <HomeProfileAlt width={20} height={20} />
            ),
        }}>
        {props => (
          <AdminProfile
            {...props}
            setIsLoggedIn={setIsLoggedIn}
            userUID={userUID}
            profile={profile}
            refetchProfile={refetchProfile}
            setDrivers={setDrivers}
            fetchDrivers={fetchDrivers}
            setCommuters={setCommuters}
            fetchCommuters={fetchCommuters}
          />
        )}
      </Tabs.Screen>

      <Tabs.Screen
        name={'AdminCommuters'}
        options={{
          // @ts-ignore
          tabBarIcon: ({focused}) =>
            focused ? (
              <AdminStudent width={20} height={20} />
            ) : (
              <AdminStudentAlt width={20} height={20} />
            ),
        }}>
        {props => (
          <AdminCommuters
            {...props}
            commuters={commuters}
            setCommuters={setCommuters}
            fetchCommuters={fetchCommuters}
          />
        )}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default AdminStack;
