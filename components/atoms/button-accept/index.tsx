import React from 'react';

import {styledText, StyledText20} from '../../../styles/text';
import {StyledTouchableRow} from '../../../styles/container';

function ButtonAccept({onClick}: any) {
  const sans = styledText();

  return (
    <StyledTouchableRow
      style={{
        width: '45%',
        height: 30,
        marginLeft: 5,
        backgroundColor: '#1FBF83',
        borderRadius: 10,
      }}
      onPress={onClick}>
      <StyledText20 style={[sans.bold, {color: '#fff'}]}>Accept</StyledText20>
    </StyledTouchableRow>
  );
}

export default ButtonAccept;
