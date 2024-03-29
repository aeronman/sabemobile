import React, {useEffect, useState} from 'react';
import {Dimensions, RefreshControl, ScrollView} from 'react-native';

import {StyledSafeAreaView} from '../../../styles/container';

import HomeHeader from '../../atoms/home-header';
import MessagesCard from '../../atoms/messages-card';

import firestore from '@react-native-firebase/firestore';

function DriverMessages({navigation, userUID, setCommuterUID}: any) {
  const [refreshing, setRefreshing] = React.useState(false);

  const [chatIds, setChatIds] = useState<string[]>([]);
  const [commuterData, setCommuterData] = useState({});

  const fetchChatIds = async () => {
    try {
      const driverRef = firestore().collection('Users').doc(userUID);
      const driverSnapshot = await driverRef.get();
      // @ts-ignore
      const messageIDs = driverSnapshot.data().messageIDs;

      // @ts-ignore
      const commuterIDs = [];

      for (const messageID of messageIDs) {
        const chatId = messageID;
        const messagesResponse = await firestore()
          .collection('Chats')
          .doc(chatId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .get();

        const messages = messagesResponse.docs.map(docSnap => ({
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
        }));

        messages.forEach(message => {
          // @ts-ignore
          if (message.sentBy && !commuterIDs.includes(message.sentBy)) {
            // @ts-ignore
            commuterIDs.push(message.sentBy);
          }
        });
      }

      // @ts-ignore
      const commuterProfile = {};

      // @ts-ignore
      for (const commuterID of commuterIDs) {
        const commuterUID = commuterID;

        if (commuterUID === userUID) {
          continue;
        }

        const commuterRef = firestore().collection('Users').doc(commuterUID);
        const commuterSnapshot = await commuterRef.get();

        // @ts-ignore
        commuterProfile[commuterUID] = commuterSnapshot.data();
      }

      setCommuterData(commuterProfile);
    } catch (error) {
      console.error('Error fetching chat IDs:', error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    fetchChatIds().then(data => setChatIds(data));
  }, [userUID]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // @ts-ignore
      fetchChatIds().then(data => setChatIds(data));
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Messages'}
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
          paddingTop: 25,
          width: '100%',
          height: Dimensions.get('window').height * 0.89,
          backgroundColor: '#e7e7e7',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        {Object.entries(commuterData).map(([commuterUID, commuter], index) => (
          <MessagesCard
            key={index}
            navigation={navigation}
            commuter={commuter}
            commuterUID={commuterUID}
            setCommuterUID={setCommuterUID}
          />
        ))}
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default DriverMessages;
