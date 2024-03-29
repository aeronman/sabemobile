import React from 'react';

import {StyledCol} from '../../../styles/container';
import {styledText, StyledText12, StyledText16} from '../../../styles/text';
import {FormTextInput} from '../../../styles/input';

function AuthEmail({
  signIn,
  email,
  setEmail,
  validity,
  setValidity,
  asUser,
}: any) {
  const sans = styledText();

  // Regular expression for email validation
  // Prod
  const emailRegex = /^[a-zA-Z0-9._-]+@dhvsu\.edu\.ph$/;

  // Test
  // Gmail Regex
  // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setValidity(emailRegex.test(text));
  };

  return (
    <>
      <StyledCol style={{width: '100%'}}>
        <StyledText16
          style={[
            sans.bold,
            {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
          ]}>
          Email
        </StyledText16>
        {!signIn && !validity && email.length >= 1 && (
          <StyledText12
            style={[
              {position: 'absolute', right: 0, color: '#FF5656'},
              sans.regular,
            ]}>
            Input a Valid Email
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
          value={email}
          onChangeText={handleEmailChange}
          placeholder="juandelacruz@gmail.com"
          placeholderTextColor="#042F40"
          autoCapitalize="none"
        />
      </StyledCol>
    </>
  );
}

export default AuthEmail;
