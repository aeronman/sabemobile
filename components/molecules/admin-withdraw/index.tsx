/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import HomeHeader from '../../atoms/home-header';

function AdminWithdraw({navigation}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [withdraw, setWithdraw] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  const fetchWithdraw = async () => {
    setIsLoading(true);
    try {
      const container: any = [];
      const snapshot = await firestore()
        .collection('Withdraw')
        .where('status', 'in', ['pending', 'rejected'])
        .get();
      snapshot.forEach(items =>
        container.push({
          id: items.id,
          payload: items.data(),
        }),
      );
      setWithdraw(container);
    } catch (error) {
      console.error('Error fetching topups:', error);
    } finally {
      setIsLoading(false);
      setIsRefetch(false);
    }
  };

  useEffect(() => {
    fetchWithdraw();
  }, [isRefetch]);

  const handleWithdrawAction = async (
    action: string,
    docID: string,
    UID: string,
    amount: number | string,
  ) => {
    try {
      const userDoc = await firestore().collection('Users').doc(UID).get();
      if (!userDoc.exists) {
        Alert.alert('User does not exist');
        return;
      }

      await firestore()
        .collection('Withdraw')
        .doc(docID)
        .update({status: action});
      if (action === 'accepted') {
        const userPoints = (userDoc.data() as any).points;
        if (userPoints <= 0) {
          await firestore().collection('Users').doc(UID).update({points: 0});
          return;
        }
        await firestore()
          .collection('Users')
          .doc(UID)
          .update({points: (userDoc.data() as any).points - (amount as any)});
      }

      setIsRefetch(prev => !prev);
      Alert.alert(
        `Top up ${action === 'accepted' ? 'successfully accepted' : 'rejected'}`,
      );
    } catch (error) {
      console.error('Error handling topup:', error);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <HomeHeader
          navigation={navigation}
          title={'Withdraw'}
          main={true}
          fromProfile={false}
        />

        {isLoading ? (
          <View>
            <Text>Loading....</Text>
          </View>
        ) : (
          <View style={{marginVertical: 120}}>
            {withdraw.length === 0 && (
              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                  No Available Top ups
                </Text>
              </View>
            )}

            {withdraw.map(({payload, id}: any) => (
              <WithdrawCard
                key={id}
                docID={id}
                UID={payload?.UID}
                amount={payload?.amount || 0}
                accountName={payload?.accountName}
                accountNumber={payload?.accountNumber}
                platform={payload?.platorm}
                status={payload?.status}
                handleWithdrawAction={handleWithdrawAction}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AdminWithdraw;

const WithdrawCard = ({
  UID,
  docID,
  amount,
  accountName,
  accountNumber,
  platform,
  status,
  handleWithdrawAction,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    await handleWithdrawAction('accepted', docID, UID, amount);
    setIsLoading(false);
  };

  const handleReject = () => {
    handleWithdrawAction('rejected', docID, UID);
  };

  return (
    <View
      style={{
        width: Dimensions.get('screen').width - 32,
        minHeight: 150,
        borderWidth: 1,
        borderColor: '#72777B',
        borderRadius: 15,
        margin: 16,
        overflow: 'hidden',
      }}>
      {/* <Image source={{uri: fileBlob}} style={{width: '100%', height: 150}} /> */}
      <View style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 48, color: 'black', fontWeight: 'bold'}}>
            {amount || 0}
          </Text>
          <Text style={{fontSize: 17, color: 'black'}}>#{accountNumber}</Text>
        </View>
        <Text style={{fontSize: 17}}>{accountName}</Text>
        <Text style={{fontSize: 17}}>{platform}</Text>

        <View style={{marginTop: 16, flexDirection: 'row', gap: 12}}>
          {status !== 'rejected' && (
            <Button
              label={isLoading ? <ActivityIndicator /> : 'Accept'}
              onPress={handleAccept}
              color="#00A36C"
              disabled={isLoading}
            />
          )}

          {!isLoading && (
            <Button
              label={isLoading ? <ActivityIndicator /> : 'Reject'}
              onPress={handleReject}
              color="#C70039"
              disabled={status === 'rejected'}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const Button = ({label, onPress, color, disabled}: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.65 : 1,
      }}
      disabled={disabled}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
