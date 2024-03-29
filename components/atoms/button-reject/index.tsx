import React from 'react';

import {styledText, StyledText20} from '../../../styles/text';
import {StyledTouchableRow} from '../../../styles/container';

function ButtonReject({onClick}: any) {
  const sans = styledText();

  return (
    <StyledTouchableRow
      style={{
        width: '45%',
        height: 30,
        marginRight: 5,
        backgroundColor: '#e70000',
        borderRadius: 10,
      }}
      onPress={onClick}>
      <StyledText20 style={[sans.bold, {color: '#fff'}]}>Reject</StyledText20>
    </StyledTouchableRow>
  );
}

export default ButtonReject;
