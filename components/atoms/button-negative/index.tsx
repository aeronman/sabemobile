import React from 'react';

import {styledText, StyledText20} from '../../../styles/text';
import {StyledTouchableRow} from '../../../styles/container';

function ButtonNegative({onClick, text}: any) {
  const sans = styledText();

  return (
    <StyledTouchableRow
      style={{
        width: '90%',
        height: 50,
        marginTop: 2.5,
        marginBottom: 5,
        backgroundColor: '#e70000',
        borderRadius: 10,
      }}
      onPress={onClick}>
      <StyledText20 style={[sans.bold, {color: '#fff'}]}>{text}</StyledText20>
    </StyledTouchableRow>
  );
}

export default ButtonNegative;
