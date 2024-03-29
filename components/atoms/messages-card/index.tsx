import React from 'react';

import {styledText, StyledText14, StyledText18} from '../../../styles/text';
import {
  StyledCol,
  StyledRow,
  StyledTouchableRow,
} from '../../../styles/container';

// @ts-ignore
import Sabe from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import Rating from '../../../assets/icons/rating.svg';

import {Image} from 'react-native';

function MessagesCard({
  navigation,
  commuter,
  commuterUID,
  setCommuterUID,
}: any) {
  const sans = styledText();

  const handleChat = () => {
    setCommuterUID(commuterUID);
    navigation.navigate('BookingsChat');
  };

  return (
    <StyledTouchableRow
      style={{
        justifyContent: 'space-around',
        width: '85%',
        height: 60,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
      onPress={handleChat}>
      {commuter.profPic ? (
        <Image
          style={{
            width: 40,
            height: 40,
            borderWidth: 2,
            borderRadius: 50,
            borderColor: '#042f40',
          }}
          source={{uri: commuter.profPic}}
        />
      ) : (
        <Sabe width={30} height={30} />
      )}
      <StyledCol style={{width: '60%'}}>
        <StyledText18 style={[sans.bold, {color: '#1FBF83'}]}>
          {commuter.name}
        </StyledText18>
        <StyledRow style={{justifyContent: 'space-around', width: '80%'}}>
          <StyledRow>
            <Rating width={20} height={20} style={{marginRight: 2.5}} />
            <StyledText14
              style={[sans.regular, {color: '#042f40', marginTop: 1.5}]}>
              {commuter.rating.toFixed(2)}
            </StyledText14>
          </StyledRow>
          <StyledRow>
            <Sabe width={17.5} height={17.5} style={{marginRight: 2.5}} />
            <StyledText14
              style={[sans.regular, {color: '#042f40', marginTop: 1.5}]}>
              {commuter.totalRides}
            </StyledText14>
          </StyledRow>
        </StyledRow>
      </StyledCol>
      <StyledCol style={{width: 25, height: 25}} />
    </StyledTouchableRow>
  );
}

export default MessagesCard;
