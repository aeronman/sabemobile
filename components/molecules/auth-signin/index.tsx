import React, {useState} from 'react';

import {
  StyledCol,
  StyledRow,
  StyledSafeAreaView,
  StyledTouchableRow,
} from '../../../styles/container';
import {
  styledText,
  StyledText14,
  StyledText16,
  StyledText30,
} from '../../../styles/text';
import {FormButton} from '../../../styles/button';

import {
  alertEmailVerification,
  alertInvalidEmail,
  alertSignInError,
  alertPasswordReset,
} from '../../../utils/alerts.ts';

// @ts-ignore
import HomeLogo from '../../../assets/icons/home-dark.svg';

import AuthEmail from '../../atoms/auth-email';
import AuthPassword from '../../atoms/auth-pass';
import AuthPhone from '../../atoms/auth-phone';

import * as Progress from 'react-native-progress';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

function AuthSignin({navigation, setProfile, setUserUID, setIsLoggedIn}: any) {
  const sans = styledText();

  const handleChangeMode = () => {
    navigation.navigate('SignUp');
  };

  const [withEmail, setWithEmail] = useState(true);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    console.log(email);
    console.log(password);
    await auth().currentUser?.reload();
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        if (auth().currentUser?.emailVerified) {
          const userDocument = await firestore()
            .collection('Users')
            .doc(auth().currentUser?.uid)
            .get();

          if (userDocument.exists) {
            const userData = userDocument.data();

            setUserUID(auth().currentUser?.uid);
            setIsLoggedIn(true);
            setProfile(userData);

            await AsyncStorage.setItem(
              'uid',
              auth().currentUser?.uid as string,
            );
            await AsyncStorage.setItem('auth', JSON.stringify(true));
            await AsyncStorage.setItem('data', JSON.stringify(userData));

            // @ts-ignore
            if (userData.type === 'admin') {
              navigation.navigate('AdminStack');
            } else {
              navigation.navigate('HomeStack');
            }
          } else {
            console.log('Document does not exist');
          }
        } else {
          await auth().currentUser?.sendEmailVerification();
          alertEmailVerification();
        }
      })
      .catch(error => {
        alertSignInError();
      });

    setEmail('');
    setPassword('');
    setPhone('');
    setIsLoading(false);
  };

  const handleForgotPass = async () => {
    await auth().currentUser?.reload();
    await auth()
      .sendPasswordResetEmail(email)
      .then(async () => {
        alertPasswordReset();
      })
      .catch(error => {
        alertInvalidEmail();
      });
  };

  return (
    <StyledSafeAreaView
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#f3f3f3',
        marginTop: 75,
        marginBottom: 50,
      }}>
      <StyledCol>
        <HomeLogo width={75} height={75} />
        <StyledText30 style={[sans.bold, {color: '#042F40'}]}>
          Sabe
        </StyledText30>
      </StyledCol>
      <StyledCol style={{width: '90%'}}>
        {withEmail ? (
          <AuthEmail
            signIn={true}
            email={email}
            setEmail={setEmail}
            validity={isValidEmail}
            setValidity={setIsValidEmail}
            asUser={false}
          />
        ) : (
          <AuthPhone
            signIn={true}
            phone={phone}
            setPhone={setPhone}
            validity={isValidPhone}
            setValidity={setIsValidPhone}
          />
        )}
        <AuthPassword
          signIn={true}
          password={password}
          setPassword={setPassword}
          setValidity={setIsValidPassword}
          handleForgotPass={handleForgotPass}
        />
      </StyledCol>
      <StyledCol style={{width: '100%'}}>
        <FormButton
          onPress={handleSignIn}
          disabled={email === '' || password === ''}>
          {!isLoading ? (
            <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
              Sign In
            </StyledText16>
          ) : (
            <Progress.Circle
              size={20}
              indeterminate={true}
              borderWidth={3}
              borderColor={'#f3f3f3'}
            />
          )}
        </FormButton>
        <StyledRow style={{marginTop: 5}}>
          <StyledText14 style={[sans.regular, {color: '#042F40'}]}>
            Don't have an account yet?{' '}
          </StyledText14>
          <StyledTouchableRow onPress={handleChangeMode}>
            <StyledText14 style={[sans.bold, {color: '#042F40'}]}>
              Sign Up
            </StyledText14>
          </StyledTouchableRow>
        </StyledRow>
      </StyledCol>
    </StyledSafeAreaView>
  );
}

export default AuthSignin;
