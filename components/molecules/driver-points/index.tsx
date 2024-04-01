/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eol-last */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */

import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import HomeHeader from '../../atoms/home-header';
import {FormTextInput} from '../../../styles/input';
import {StyledText16, styledText} from '../../../styles/text';
import firestore from '@react-native-firebase/firestore';

const DriverWithdrawPoints = ({navigation, userID}: any) => {
  const [currentDetails, setCurrentDetails] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [widthdrawAmmount, setWithdrawAmmount] = useState('');
  const [platorm, setPlatform] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const existance = await firestore().collection('Users').doc(userID).get();
      if (!existance.exists) {
        Alert.alert('User doest exist');
        return;
      }
      setCurrentDetails(existance.data() as any);
    };

    fetchUserDetails();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    const {points: accountPoints} = currentDetails as any;
    if (widthdrawAmmount > accountPoints) {
      Alert.alert(
        `You have exceeded your point Limit, Balance: ${accountPoints}`,
      );
      setLoading(false);

      return;
    }

    try {
      await firestore().collection('Withdraw').add({
        UID: userID,
        accountName,
        accountNumber,
        amount: widthdrawAmmount,
        platorm: platorm,
        status: 'pending',
      });

      setAccountName('');
      setAccountNumber('');
      setWithdrawAmmount('');
      setPlatform('');
      setLoading(false);
      Alert.alert('Sent Successfully');
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <HomeHeader
          navigation={navigation}
          title={'Widthdraw Points'}
          fromProfile={false}
        />

        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <FormField
            label="Account Name"
            value={accountName}
            onChange={setAccountName}
          />
          <FormField
            keyboardType={'numeric'}
            label="Account Number"
            value={accountNumber}
            onChange={setAccountNumber}
          />
          <FormField
            keyboardType={'numeric'}
            label={'Amount'}
            value={widthdrawAmmount}
            onChange={setWithdrawAmmount}
          />

          <FormSelectField
            label="Platform"
            value={platorm}
            onChange={setPlatform}
          />

          <TouchableHighlight
            disabled={loading}
            onPress={onSubmit}
            style={{
              backgroundColor: '#042F40',
              width: '100%',
              padding: 16,
              opacity: loading ? 0.65 : 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                Widthdraw Points
              </Text>
            )}
          </TouchableHighlight>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const FormField = ({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: any;
  onChange: any;
  keyboardType?: any;
}) => {
  const sans = styledText();
  return (
    <View style={{marginBottom: 12, width: '100%'}}>
      <StyledText16
        style={[
          sans.bold,
          {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
        ]}>
        {label}
      </StyledText16>
      <FormTextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const FormSelectField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: any;
  keyboardType?: any;
}) => {
  const sans = styledText();
  return (
    <View style={{marginBottom: 12, width: '100%'}}>
      <StyledText16
        style={[
          sans.bold,
          {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
        ]}>
        {label}
      </StyledText16>
      <View style={{borderWidth: 2, borderColor: '#042F40'}}>
        <RNPickerSelect
          onValueChange={value => onChange(value)}
          items={[
            {label: 'Gcash', value: 'gcash'},
            {label: 'Paymaya', value: 'paymaya'},
            {label: 'Palawan', value: 'Palawan'},
          ]}
        />
      </View>
    </View>
  );
};

export default DriverWithdrawPoints;

function generateScrambledCode() {
  const letters = Array.from({length: 3}, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  );
  const numbers = Array.from({length: 3}, () => Math.floor(Math.random() * 10));
  const code = [...letters, ...numbers];
  for (let i = code.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [code[i], code[j]] = [code[j], code[i]];
  }
  return code.join('');
}
