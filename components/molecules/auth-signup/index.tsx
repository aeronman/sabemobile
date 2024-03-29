import React, {useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';

import {
  StyledCol,
  StyledKeyboardView,
  StyledRow,
  StyledSafeAreaView,
} from '../../../styles/container';
import {
  styledText,
  StyledText14,
  StyledText16,
  StyledText30,
} from '../../../styles/text';
import {FormButton, FormButtonHalf} from '../../../styles/button';
import {alertAlreadyUsed, alertInvalidEmail} from '../../../utils/alerts.ts';

// @ts-ignore
import HomeLogo from '../../../assets/icons/home-dark.svg';

import AuthName from '../../atoms/auth-name';
import AuthEmail from '../../atoms/auth-email';
import AuthPassword from '../../atoms/auth-pass';
import AuthPhone from '../../atoms/auth-phone';
import AuthOrcr from '../../atoms/auth-orcr';
import AuthLicense from '../../atoms/auth-license';
import AuthId from '../../atoms/auth-id';

import * as Progress from 'react-native-progress';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// @ts-ignore
function AuthSignUp({navigation}) {
  const sans = styledText();

  const [asUser, setAsUser] = useState(true);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleStep = () => {
    setStep(step + 1);
  };

  const handleChangeMode = () => {
    navigation.navigate('SignIn');
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('');
  const [make, setMake] = useState('');
  const [series, setSeries] = useState('');

  const [schoolID, setSchoolID] = useState('');
  const [regImage, setRegImage] = useState('');
  const [licenseImage, setLicenseImage] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  const handleChangeUser = () => {
    setAsUser(prevState => !prevState);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');

    setPlate('');
    setColor('');
    setMake('');
    setSeries('');

    setStep(1);
  };

  // @ts-ignore
  const alertEmailVerification = navigation =>
    Alert.alert(
      'Email Verification Sent',
      'Check your email and verify your account.',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            navigation.navigate('SignIn');
          },
        },
      ],
    );

  const handleSignUpCommuter = async () => {
    setIsLoading(true);

    console.log(email);
    try {
      // Create user using Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Send email verification
      await userCredential.user?.sendEmailVerification();
      alertEmailVerification(navigation);

      // Upload image to Firebase Storage
      const fileName =
        name + '-' + schoolID.substring(schoolID.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`commuters/${fileName}`);
      const task = storageRef.putFile(schoolID);
      const downloadURL = await task.then(() => storageRef.getDownloadURL());

      // Add user data to Firestore
      await firestore().collection('Users').doc(auth().currentUser?.uid).set({
        type: 'commuter',
        name: name,
        email: email,
        contact: phone,
        score: 0,
        rating: 0,
        totalRides: 0,
        points: 0,
        schoolIDUrl: downloadURL,
        isVerified: false,
      });

      console.log('User added!');
    } catch (error) {
      // @ts-ignore
      if (error.code === 'auth/email-already-in-use') {
        alertAlreadyUsed();
        setStep(1);
        // @ts-ignore
      } else if (error.code === 'auth/invalid-email') {
        alertInvalidEmail();
        setStep(1);
      } else {
        console.error('Error creating user:', error);
        setStep(1);
      }
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleSignUpDriver = async () => {
    setIsLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Send email verification
      await userCredential.user?.sendEmailVerification();

      // Upload image to Firebase Storage
      const regImageName =
        name + 'ORCR-' + regImage.substring(regImage.lastIndexOf('/') + 1);
      const storageRef1 = storage().ref(`drivers/${regImageName}`);
      const task1 = storageRef1.putFile(regImage);
      const downloadURL1 = await task1.then(() => storageRef1.getDownloadURL());

      const licenseImageName =
        name +
        'License-' +
        licenseImage.substring(licenseImage.lastIndexOf('/') + 1);
      const storageRef2 = storage().ref(`drivers/${licenseImageName}`);
      const task2 = storageRef2.putFile(licenseImage);
      const downloadURL2 = await task2.then(() => storageRef2.getDownloadURL());

      // Add user data to Firestore
      await firestore().collection('Users').doc(auth().currentUser?.uid).set({
        type: 'driver',
        name: name,
        email: email,
        contact: phone,
        carMake: make,
        carSeries: series,
        carColor: color,
        carPlate: plate,
        rating: 0,
        totalRides: 0,
        points:0,
        regIDUrl: downloadURL1,
        licenseIDUrl: downloadURL2,
        isVerified: false,
      });

      alertEmailVerification(navigation);
    } catch (error) {
      // @ts-ignore
      if (error.code === 'auth/email-already-in-use') {
        alertInvalidEmail();
        setStep(1);
        // @ts-ignore
      } else if (error.code === 'auth/invalid-email') {
        alertInvalidEmail();
        setStep(1);
      } else {
        console.error('Error creating user:', error);
        setStep(1);
      }
    }

    setIsLoading(false);
  };

  return (
    <StyledKeyboardView
      behavior="padding"
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#f3f3f3',
        marginTop: 50,
        marginBottom: 25,
      }}>
      <StyledCol>
        <HomeLogo width={75} height={75} />
        <StyledText30 style={[sans.bold, {color: '#042F40'}]}>
          Sabe
        </StyledText30>
      </StyledCol>
      <StyledCol style={{width: '100%'}}>
        <StyledText14 style={[sans.regular, {color: '#042F40'}]}>
          Sign up as
        </StyledText14>
        <StyledRow style={{marginTop: 5, marginBottom: 10}}>
          <FormButtonHalf
            style={{
              backgroundColor: asUser ? '#042F40' : '#f3f3f3',
            }}
            disabled={asUser}
            onPress={handleChangeUser}>
            <StyledText16
              style={[sans.regular, {color: asUser ? '#f3f3f3' : '#042F40'}]}>
              Commuter
            </StyledText16>
          </FormButtonHalf>
          <FormButtonHalf
            style={{
              backgroundColor: !asUser ? '#042F40' : '#f3f3f3',
            }}
            disabled={!asUser}
            onPress={handleChangeUser}>
            <StyledText16
              style={[sans.regular, {color: !asUser ? '#f3f3f3' : '#042F40'}]}>
              Driver
            </StyledText16>
          </FormButtonHalf>
        </StyledRow>
        {(asUser || !asUser) && step === 1 && (
          <StyledCol style={{width: '90%'}}>
            <AuthName name={name} setName={setName} mode={'Name'} />
            <AuthEmail
              signIn={false}
              email={email}
              setEmail={setEmail}
              validity={isValidEmail}
              setValidity={setIsValidEmail}
              asUser={asUser}
            />
            <AuthPhone
              signIn={false}
              phone={phone}
              setPhone={setPhone}
              validity={isValidPhone}
              setValidity={setIsValidPhone}
            />
            <AuthPassword
              signIn={false}
              password={password}
              setPassword={setPassword}
              setValidity={setIsValidPassword}
              handleForgotPass={null}
            />
          </StyledCol>
        )}
        {asUser && step === 2 && (
          <StyledCol style={{width: '90%'}}>
            <AuthId schoolID={schoolID} setSchoolID={setSchoolID} />
          </StyledCol>
        )}
        {!asUser && step === 2 && (
          <StyledCol style={{width: '90%'}}>
            <AuthName name={plate} setName={setPlate} mode={'Plate Number'} />
            <AuthName name={color} setName={setColor} mode={'Color'} />
            <AuthName name={make} setName={setMake} mode={'Make'} />
            <AuthName name={series} setName={setSeries} mode={'Series'} />
          </StyledCol>
        )}
        {!asUser && step === 3 && (
          <StyledCol style={{width: '90%'}}>
            <AuthLicense
              licenseImage={licenseImage}
              setLicenseImage={setLicenseImage}
            />
            <AuthOrcr regImage={regImage} setRegImage={setRegImage} />
          </StyledCol>
        )}
      </StyledCol>
      <StyledCol style={{width: '100%'}}>
        {asUser ? (
          <>
            {step === 1 && (
              <FormButton
                onPress={handleStep}
                disabled={
                  name === '' ||
                  !isValidEmail ||
                  !isValidPhone ||
                  !isValidPassword
                }>
                <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
                  Next
                </StyledText16>
              </FormButton>
            )}
            {step === 2 && (
              <FormButton
                disabled={schoolID === ''}
                onPress={handleSignUpCommuter}>
                {!isLoading ? (
                  <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
                    Sign Up
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
            )}
          </>
        ) : (
          <>
            {step === 1 && (
              <FormButton
                onPress={handleStep}
                disabled={
                  name === '' ||
                  !isValidEmail ||
                  !isValidPhone ||
                  !isValidPassword
                }>
                <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
                  Next
                </StyledText16>
              </FormButton>
            )}
            {step === 2 && (
              <FormButton
                onPress={handleStep}
                disabled={
                  plate === '' || color === '' || make === '' || series === ''
                }>
                <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
                  Next
                </StyledText16>
              </FormButton>
            )}
            {step === 3 && (
              <FormButton
                disabled={licenseImage === '' && regImage === ''}
                onPress={handleSignUpDriver}>
                {!isLoading ? (
                  <StyledText16 style={[sans.regular, {color: '#f3f3f3'}]}>
                    Sign Up
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
            )}
          </>
        )}
        <StyledRow style={{marginTop: 5}}>
          <StyledText14 style={[sans.regular, {color: '#042F40'}]}>
            Already have an account?{' '}
          </StyledText14>
          <TouchableOpacity onPress={handleChangeMode}>
            <StyledText14 style={[sans.bold, {color: '#042F40'}]}>
              Sign In
            </StyledText14>
          </TouchableOpacity>
        </StyledRow>
      </StyledCol>
    </StyledKeyboardView>
  );
}

export default AuthSignUp;
