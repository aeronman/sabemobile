import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText} from '../../../styles/text';

import HomeHeader from '../../atoms/home-header';

import {
  Avatar,
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Message,
  Send,
} from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';

function ChatRide({navigation, userUID, driverUID, bookingUID}: any) {
  const sans = styledText();

  // @ts-ignore
  const renderMessage = props => {
    return (
      <Message
        {...props}
        showUserAvatar={true}
        containerStyle={{backgroundColor: 'red'}}
      />
    );
  };

  // @ts-ignore
  const renderAvatar = props => {
    return (
      <Avatar
        {...props}
        showAvatarForEveryMessage={false}
        imageStyle={{
          right: {
            width: 0,
            height: 0,
          },
          left: {
            borderWidth: 1,
            borderColor: '#fff',
            width: 27.5,
            height: 27.5,
          },
        }}
      />
    );
  };

  // @ts-ignore
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: '#000',
          },
          right: {
            color: '#fff',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#1FBF83',
          },
        }}
      />
    );
  };

  // @ts-ignore
  const renderSend = props => {
    return (
      <StyledCol style={{marginBottom: 7.5}}>
        <Send {...props} textStyle={[sans.bold, {color: '#1FBF83'}]} />
      </StyledCol>
    );
  };

  // @ts-ignore
  const renderComposer = props => {
    return (
      <Composer
        {...props}
        multiline={false}
        textInputProps={{
          marginTop: 10,
          marginBottom: 10,
          blurOnSubmit: true,
          paddingHorizontal: 15,
          paddingTop: 7.5,
          borderRadius: 50,
          backgroundColor: '#f3f3f3',
          width: '80%',
          height: 40,
        }}
        textInputStyle={[sans.bold, {paddingBottom: 2.5, color: '#878787'}]}
        placeholder={'Message'}
        placeholderTextColor={'#878787'}
      />
    );
  };

  // @ts-ignore
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#042F40',
          borderTopWidth: 0,
        }}
      />
    );
  };

  const [messages, setMessages] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');

  const getProfilePicture = async () => {
    try {
      const userRef = await firestore().collection('Users').doc(userUID).get();

      if (userRef.exists) {
        const data = userRef.data();

        // @ts-ignore
        setProfilePicture(data.profPic);
      }
    } catch (error) {
      console.log('Error fetching profile picture: ', error);
    }
  };

  const getAllMessages = async () => {
    const chatid = bookingUID + '-' + driverUID;
    const msgResponse = await firestore()
      .collection('Chats')
      .doc(chatid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allTheMsgs = msgResponse.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });

    // @ts-ignore
    setMessages(allTheMsgs);
  };

  useEffect(() => {
    getProfilePicture();
    getAllMessages();

    const intervalId = setInterval(() => {
      getAllMessages();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // @ts-ignore
  const handleSendId = async chatid => {
    try {
      const driverRef = firestore().collection('Users').doc(driverUID);
      const driverSnapshot = await driverRef.get();
      const messageIDsArray = driverSnapshot.data()?.messageIDs || [];

      if (!messageIDsArray.includes(chatid)) {
        await driverRef.update({
          // @ts-ignore
          chatID: firestore.FieldValue.arrayUnion(chatid),
        });
        console.log('Chat ID added successfully');
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // @ts-ignore
  const onSend = async msgArray => {
    const msg = msgArray[0];
    const usermsg = {
      ...msg,
      sentBy: userUID,
      sentTo: driverUID,
      createdAt: new Date(),
      user: {
        _id: userUID,
        avatar:
          profilePicture !== ''
            ? profilePicture
            : 'https://firebasestorage.googleapis.com/v0/b/sabe-d5999.appspot.com/o/images%2Fcar-svgrepo-com.png?alt=media&token=2f39545c-34be-4669-95a5-12bb2195204e',
      },
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, usermsg),
    );
    const chatid = bookingUID + '-' + driverUID;

    handleSendId(chatid);
    firestore()
      .collection('Chats')
      .doc(chatid)
      .collection('messages')
      .add({...usermsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'flex-start',
        backgroundColor: '#042F40',
      }}>
      <HomeHeader
        navigation={navigation}
        title={'Ride Chat'}
        main={true}
        fromProfile={false}
      />
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: userUID,
        }}
        renderSend={renderSend}
        renderAvatar={renderAvatar}
        renderBubble={renderBubble}
        renderMessage={renderMessage}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        messagesContainerStyle={{
          width: Dimensions.get('window').width,
          height: '95.75%',
          paddingBottom: 10,
          backgroundColor: '#f3f3f3',
        }}
        keyboardShouldPersistTaps="never"
        inverted
        scrollToBottom
        infiniteScroll
        alwaysShowSend
      />
    </StyledSafeAreaView>
  );
}

export default ChatRide;
