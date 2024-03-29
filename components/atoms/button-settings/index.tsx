import React from 'react';

import {styledText, StyledText18} from '../../../styles/text';
import {StyledTouchableCol} from '../../../styles/container';

function ButtonSettings({setting, onClick}: any) {
  const sans = styledText();

  return (
    <StyledTouchableCol
      style={{
        width: '85%',
        height: 50,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
      onPress={onClick}>
      <StyledText18 style={[sans.regular, {color: '#042F40'}]}>
        {setting}
      </StyledText18>
    </StyledTouchableCol>
  );
}

export default ButtonSettings;
