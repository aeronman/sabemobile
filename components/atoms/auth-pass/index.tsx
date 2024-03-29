import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {StyledCol, StyledTouchableCol} from '../../../styles/container';
import {
  styledText,
  StyledText12,
  StyledText14,
  StyledText16,
} from '../../../styles/text';
import {FormTextInput} from '../../../styles/input';

// @ts-ignore
import ShowLogo from '../../../assets/icons/show.svg';
// @ts-ignore
import HideLogo from '../../../assets/icons/hide.svg';

function AuthPassword({
  signIn,
  password,
  setPassword,
  setValidity,
  handleForgotPass,
}: any) {
  const sans = styledText();

  // Regular expression for password validation
  const isLengthValid = password.length >= 8;
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setValidity(passwordRegex.test(text));
  };

  const [isMasked, setIsMasked] = useState(true);

  const handleShowHide = () => {
    setIsMasked(prevState => !prevState);
  };

  return (
    <>
      <StyledCol style={{width: '100%'}}>
        <StyledText16
          style={[
            sans.bold,
            {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
          ]}>
          Password
        </StyledText16>
        {!signIn && !isLengthValid && (
          <StyledText12
            style={[
              sans.regular,
              {position: 'absolute', right: 0, color: '#FF5656'},
            ]}>
            Must be at least 8 characters
          </StyledText12>
        )}
        {!signIn && isLengthValid && !hasCapitalLetter && (
          <StyledText12
            style={[
              sans.regular,
              {position: 'absolute', right: 0, color: '#FF5656'},
            ]}>
            Must have 1 Capital letter
          </StyledText12>
        )}
        {!signIn && isLengthValid && hasCapitalLetter && !hasNumber && (
          <StyledText12
            style={[
              sans.regular,
              {position: 'absolute', right: 0, color: '#FF5656'},
            ]}>
            Must have 1 Number
          </StyledText12>
        )}
      </StyledCol>
      <StyledCol
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'flex-end',
          marginTop: 5,
          marginBottom: 5,
        }}>
        <FormTextInput
          secureTextEntry={isMasked}
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="•••••••••••"
          placeholderTextColor="#042F40"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={handleShowHide}
          style={{position: 'absolute', right: 15}}>
          {isMasked ? (
            <ShowLogo width={25} height={25} />
          ) : (
            <HideLogo width={25} height={25} />
          )}
        </TouchableOpacity>
      </StyledCol>
      {signIn && (
        <StyledTouchableCol style={{width: '100%'}} onPress={handleForgotPass}>
          <StyledText14
            style={[sans.bold, {color: '#042F40', alignSelf: 'flex-end'}]}>
            Forgot Password?
          </StyledText14>
        </StyledTouchableCol>
      )}
    </>
  );
}

export default AuthPassword;
