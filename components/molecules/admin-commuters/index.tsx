import React from 'react';
import {Dimensions, RefreshControl, ScrollView} from 'react-native';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';

import HomeHeader from '../../atoms/home-header';
import DetailsCardCommuter from '../../atoms/details-card-commuter';

// @ts-ignore
import Sabe from '../../../assets/icons/home-dark.svg';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function AdminCommuters({navigation, commuters, setCommuters, fetchCommuters}) {
  const sans = styledText();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // @ts-ignore
      fetchCommuters().then(data => setCommuters(data));
      setRefreshing(false);
    }, 2000);
  }, []);

  // @ts-ignore
  const handleApprove = async commuterId => {
    try {
      // Update the isVerified property in Firestore
      await firestore()
        .collection('Users')
        .doc(commuterId)
        .update({isVerified: true});

      // Update the state to reflect the changes
      const updatedCommuters = await fetchCommuters();
      // @ts-ignore
      setCommuters(updatedCommuters);
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
      <HomeHeader
        navigation={navigation}
        title={'Commuters'}
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
        {commuters.length > 0 ? (
          // @ts-ignore
          commuters.map((commuter, index) => (
            <DetailsCardCommuter
              key={index}
              // @ts-ignore
              id={commuter.id}
              // @ts-ignore
              data={commuter.data}
              onApprove={handleApprove}
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

export default AdminCommuters;
