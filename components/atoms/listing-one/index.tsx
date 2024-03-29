import React from 'react';
import {Dimensions} from 'react-native';

import {styledText, StyledText14, StyledText16} from '../../../styles/text';
import {StyledCol} from '../../../styles/container';

function ListingOne({label, data}: any) {
  const sans = styledText();

  return (
    <StyledCol
      style={{
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width * 0.75,
        marginTop: 5,
      }}>
      <StyledText14
        style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
        {label}
      </StyledText14>
      <StyledText16
        style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
        {data}
      </StyledText16>
    </StyledCol>
  );
}

export default ListingOne;
