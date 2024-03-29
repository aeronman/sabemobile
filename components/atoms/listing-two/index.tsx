import React from 'react';
import {Dimensions} from 'react-native';

import {StyledCol, StyledRow} from '../../../styles/container';
import {styledText, StyledText14, StyledText16} from '../../../styles/text';

function ListingTwo({labelOne, dataOne, labelTwo, dataTwo}: any) {
  const sans = styledText();

  return (
    <StyledRow
      style={{
        width: Dimensions.get('window').width * 0.75,
        marginTop: 10,
      }}>
      <StyledCol style={{width: labelOne === 'Email' ? '75%' : '50%'}}>
        <StyledText14
          style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
          {labelOne}
        </StyledText14>
        <StyledText16
          style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
          {dataOne}
        </StyledText16>
      </StyledCol>
      <StyledCol style={{width: labelTwo === 'Fare' ? '25%' : '50%'}}>
        <StyledText14
          style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
          {labelTwo}
        </StyledText14>
        <StyledText16
          style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
          {labelTwo === 'Fare' ? `PHP ${dataTwo}` : dataTwo}
        </StyledText16>
      </StyledCol>
    </StyledRow>
  );
}

export default ListingTwo;
