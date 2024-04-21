import React, {useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

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
  const [modalVisible, setModalVisible] = useState(false); // State variable for modal visibility
  const [termsAccepted, setTermsAccepted] = useState(false); // State variable for terms acceptance
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
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

  const handlePrivacyPolicy = () => {
  setPrivacyModalVisible(true);
};
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
    if (!termsAccepted) {
      Alert.alert(
        'Terms and Conditions',
        'Please accept the Terms and Conditions to proceed with registration.',
        [{ text: 'OK', onPress: () => setIsLoading(false) }]
      );
      return;
    }
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
        bookingRequest:false,
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
  const handleAcceptTerms = () => {
    if (!termsAccepted) {
      setModalVisible(true); // Open the modal only if terms are not accepted
    }
  };

  const handleSignUpDriver = async () => {
    if (!termsAccepted) {
      Alert.alert(
        'Terms and Conditions',
        'Please accept the Terms and Conditions to proceed with registration.',
        [{ text: 'OK', onPress: () => setIsLoading(false) }]
      );
      return;
    }
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
        points: 0,
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
      <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
      <ScrollView>
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
      </ScrollView>
      </KeyboardAvoidingView>
      
      
      <TouchableOpacity onPress={handlePrivacyPolicy}>
        <StyledText14 style={[sans.regular, { color: '#042F40' }]}>
          View Privacy Policy
        </StyledText14>
      </TouchableOpacity>
      {/* Accept Terms and Conditions */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        
        <CheckBox value={termsAccepted} onValueChange={setTermsAccepted} />
        <TouchableOpacity onPress={handleAcceptTerms}>
          <StyledText14 style={[sans.regular, {color: '#042F40'}]}>
            I accept the Terms and Conditions
          </StyledText14>
        </TouchableOpacity>
        
      </View>
      

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => {
          setPrivacyModalVisible(false);
        }}
      >
        <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <StyledCol style={{ padding: 20 }}>
            <StyledText16 style={[sans.bold, { color: '#042F40', marginBottom: 10 }]}>
              Privacy Policy
            </StyledText16>
            {/* Replace with your privacy policy content wrapped in Text component */}
            <Text>
             We value your privacy and are committed to protecting your personal information.
This Privacy Policy outlines how we collect, use, and safeguard your data when
you use our mobile application, SABE.{'\n'}
<Text style={{ fontWeight: 'bold' }}>Information We Collect:</Text>{'\n'}
1. <Text style={{ fontWeight: 'bold' }}>Personal Information</Text>: We may collect your name, email address, phone number,
when you register an account with SABE.{'\n'}
2. <Text style={{ fontWeight: 'bold' }}>Location Information</Text>: SABE uses your device's location services to provide
accurate ride-sharing services.{'\n'}
3. <Text style={{ fontWeight: 'bold' }}>Usage Data</Text>: We collect information about how you interact with SABE to
improve our services and user experience.{'\n'}
4. <Text style={{ fontWeight: 'bold' }}>Communication Data</Text>: We may collect your messages, feedback, and customer
support inquiries when you communicate with us through SABE.{'\n'}{'\n'}
How We Use Your Information:{'\n'}
- <Text style={{ fontWeight: 'bold' }}>To Provide Services</Text>: We use your information to facilitate ride-sharing services,
process payments, and provide customer support.{'\n'}
- <Text style={{ fontWeight: 'bold' }}>Personalization</Text>: We personalize your experience by recommending routes and
offering promotions tailored to your preferences.{'\n'}
- <Text style={{ fontWeight: 'bold' }}>Analytics</Text>: We analyze usage data to improve SABE's performance and optimize
our services.{'\n'}
- <Text style={{ fontWeight: 'bold' }}>Communications</Text>: We use your contact information to communicate with you
about your account, service updates, and promotional offers.
{'\n'}
{'\n'}
- <Text style={{ fontWeight: 'bold' }}>Data Security</Text>:{'\n'}
We implement industry-standard security measures to protect your personal
information from unauthorized access, disclosure, alteration, or destruction.
{'\n'}
By using SABE, you consent to the collection and use of your personal information
as outlined in this Privacy Policy. If you have any questions or concerns, please
contact us at <Text style={{ fontWeight: 'bold' }}> 0975-124-9734 </Text> or at our email <Text style={{ fontWeight: 'bold' }}> 2020101221@dhvsu.edu.ph </Text>
This Privacy Policy is effective as of March 23,2024 and may be updated from time
to time.
            </Text>
          </StyledCol>
          
          <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
            <StyledText16 style={[sans.bold, { color: '#042F40' }]}>
              Back
            </StyledText16>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Modal for Terms and Conditions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <ScrollView style={{flex: 1, backgroundColor: '#ffffff'}}>
          <StyledCol style={{padding: 20}}>
            <StyledText16
              style={[sans.bold, {color: '#042F40', marginBottom: 10}]}>
              General Terms and Conditions
            </StyledText16>
            <Text>
             
            
Welcome to SABE! By using our mobile application, you agree to comply with the
following terms and conditions:{'\n'}{'\n'}          
By using SABE, you acknowledge and agree that we are not liable for any
accidents, injuries, damages, or losses that may occur while using our app,
including but not limited to riding activities.{'\n'} {'\n'}  
You are responsible for your own safety while using SABE. Please adhere to all
local laws and regulations regarding riding activities and safety precautions.{'\n'}
{'\n'}
You agree not to misuse SABE by engaging in any unlawful activities, violating the
rights of others, or attempting to harm our platform or its users in any way.
We are committed to protecting your privacy and personal information. Rest
assured, your chats are not seen by the admin for your security purposes and are
only between you and the driver. Please refer to our Privacy Policy for details on
how we collect, use, and safeguard your data.{'\n'}{'\n'}  
We reserve the right to update or modify these terms and conditions at any time
without prior notice. By continuing to use SABE, you agree to be bound by the
latest version of the user agreement.{'\n'}{'\n'}  
If you have any questions or concerns regarding this user agreement or SABE in
general, please contact us at <Text style={{ fontWeight: 'bold' }}> 0975-124-9734 </Text> or at this email
<Text style={{ fontWeight: 'bold' }}> 2020101221@dhvsu.edu.ph </Text>{'\n'} {'\n'}  
By using SABE, you acknowledge that you have read, understood, and agree to
be bound by these terms and conditions. If you do not agree with any part of this
agreement, please refrain from using our mobile application. Thank you.
            </Text>
          </StyledCol>
          
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <StyledText16 style={[sans.bold, {color: '#042F40'}]}>
              Back
            </StyledText16>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
      
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
