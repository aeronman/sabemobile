import React from 'react';

import {StyledCol} from '../../../styles/container';
import {styledText, StyledText12, StyledText16} from '../../../styles/text';
import {FormTextInput} from '../../../styles/input';

function AuthFirstName({signIn, phone, setPhone, validity, setValidity}: any) {
  const sans = styledText();

  const phoneRegex = /^09\d{9}$/;

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    setValidity(phoneRegex.test(text));
  };

  return (
    <>
      <StyledCol style={{width: '100%'}}>
        <StyledText16
          style={[
            sans.bold,
            {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
          ]}>
          Phone
        </StyledText16>
        {!signIn && !validity && (
          <StyledText12
            style={[
              sans.regular,
              {position: 'absolute', right: 0, color: '#FF5656'},
            ]}>
            Must be 11 digits
          </StyledText12>
        )}
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
          keyboardType="numeric"
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="09XX-XXX-XXXX"
          placeholderTextColor="#042F40"
        />
      </StyledCol>
    </>
  );
}

export default AuthFirstName;
