import React from 'react';
import {Dimensions, RefreshControl, ScrollView} from 'react-native';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';

import HomeHeader from '../../atoms/home-header';
import DetailsCardDriver from '../../atoms/details-card-driver';

// @ts-ignore
import Sabe from '../../../assets/icons/home-dark.svg';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function AdminDrivers({navigation, drivers, setDrivers, fetchDrivers}) {
  const sans = styledText();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // @ts-ignore
      fetchDrivers().then(data => setDrivers(data));
      setRefreshing(false);
    }, 2000);
  }, []);

  // @ts-ignore
  const handleApprove = async driverId => {
    try {
      // Update the isVerified property in Firestore
      await firestore()
        .collection('Users')
        .doc(driverId)
        .update({isVerified: true});

      // Update the state to reflect the changes
      const updatedCommuters = await fetchDrivers();
      // @ts-ignore
      setDrivers(updatedCommuters);
    } catch (error) {
      console.error('Error updating isVerified: ', error);
    }
  };

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader navigation={navigation} title={'Drivers'} main={true} />
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
        {drivers.length > 0 ? (
          // @ts-ignore
          drivers.map((driver, index) => (
            <DetailsCardDriver
              key={index}
              // @ts-ignore
              id={driver.id}
              // @ts-ignore
              data={driver.data}
              // @ts-ignore
              onApprove={() => handleApprove(driver.id)}
            />
          ))
        ) : (
          <StyledCol style={{marginTop: 50}}>
            <Sabe width={100} height={100} />
            <StyledText18
              style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
              No Verification Requests
            </StyledText18>
          </StyledCol>
        )}
        <StyledCol style={{width: '100%', height: 100}} />
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default AdminDrivers;
