import React from 'react';

import {StyledCol} from '../../../styles/container';
import {styledText, StyledText16} from '../../../styles/text';
import {FormTextInput} from '../../../styles/input';

function AuthFirstName({name, setName, mode}: any) {
  const sans = styledText();

  const handleNameChange = (text: string) => {
    setName(text);
  };

  let placeholder;

  if (mode === 'Name') {
    placeholder = 'Juan Dela Cruz';
  } else if (mode === 'Plate Number') {
    placeholder = '123 ABCD';
  } else if (mode === 'Color') {
    placeholder = 'Red';
  } else if (mode === 'Make') {
    placeholder = 'Toyota';
  } else if (mode === 'Series') {
    placeholder = 'Corolla';
  }

  return (
    <>
      <StyledCol style={{width: '100%'}}>
        <StyledText16
          style={[
            sans.bold,
            {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
          ]}>
          {mode}
        </StyledText16>
      </StyledCol>
      <StyledCol
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          marginBottom: 5,
        }}>
        <FormTextInput
          value={name}
          onChangeText={handleNameChange}
          placeholder={placeholder}
          placeholderTextColor="#042F40"
        />
      </StyledCol>
    </>
  );
}

export default AuthFirstName;
