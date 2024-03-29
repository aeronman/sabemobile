import React from 'react';
import {TextInput} from 'react-native';

import {styledText, StyledText14, StyledText26} from '../../../styles/text';
import {StyledCol, StyledRow} from '../../../styles/container';

function InputPax({pax, setPax}: any) {
  const sans = styledText();

  return (
    <StyledCol style={{width: '50%'}}>
      <StyledRow style={{alignSelf: 'flex-start'}}>
        <StyledText14
          style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
          Available Seats
        </StyledText14>
        <StyledText14
          style={[
            sans.regular,
            {color: '#e70000', alignSelf: 'flex-start', marginLeft: 5},
          ]}>
          *
        </StyledText14>
      </StyledRow>
      <StyledRow style={{alignSelf: 'flex-start'}}>
        <TextInput
          style={[sans.bold, {fontSize: 26, color: '#042F40'}]}
          keyboardType={'numeric'}
          placeholder={'0'}
          placeholderTextColor={'#042F40'}
          value={pax}
          onChangeText={text => setPax(text)}
        />
        <StyledText26
          style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
          {' '}
          PAX
        </StyledText26>
      </StyledRow>
    </StyledCol>
  );
}

export default InputPax;
