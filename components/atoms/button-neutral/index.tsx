import React from 'react';

import {styledText, StyledText20} from '../../../styles/text';
import {StyledTouchableRow} from '../../../styles/container';

// @ts-ignore
import AnimatedEllipsis from 'react-native-animated-ellipsis';

function ButtonNegative({text}: any) {
  const sans = styledText();

  return (
    <StyledTouchableRow
      style={{
        width: '90%',
        height: 50,
        marginTop: 2.5,
        marginBottom: 5,
        backgroundColor: '#C1C4D6',
        borderRadius: 10,
      }}
      disabled={true}>
      <StyledText20 style={[sans.bold, {color: '#fff'}]}>{text}</StyledText20>
      <AnimatedEllipsis
        style={{
          color: '#fff',
          fontSize: 20,
          letterSpacing: -2.5,
        }}
      />
    </StyledTouchableRow>
  );
}

export default ButtonNegative;
