import React from 'react';

import {styledText, StyledText20} from '../../../styles/text';
import {StyledTouchableRow} from '../../../styles/container';

// @ts-ignore
import Chat from '../../../assets/icons/chat.svg';

function ButtonNegative({onClick, text}: any) {
  const sans = styledText();

  return (
    <StyledTouchableRow
      style={{
        width: '90%',
        height: 50,
        marginTop: 2.5,
        marginBottom: 5,
        backgroundColor: '#1FBF83',
        borderRadius: 10,
      }}
      onPress={onClick}>
      <StyledText20 style={[sans.bold, {color: '#fff'}]}>{text}</StyledText20>
      {text === 'Ride Chat' && (
        <Chat width={20} height={20} style={{marginLeft: 5}} />
      )}
    </StyledTouchableRow>
  );
}

export default ButtonNegative;
