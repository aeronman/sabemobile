import {Alert} from 'react-native';

export const alertEmailVerification = () =>
  Alert.alert('Unverified Email', 'Check your email to verify your account.', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

export const alertInvalidEmail = () =>
  Alert.alert('Invalid Email', 'Please provide a valid email.', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

export const alertAlreadyUsed = () =>
  Alert.alert('Invalid Email', 'Email already in use.', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

export const alertSignInError = () =>
  Alert.alert('Sign In Error', 'Invalid Email / Password', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

export const alertPasswordReset = () =>
  Alert.alert(
    'Password Reset Link',
    'Check your email and reset your password.',
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  );

export const alertMissingDetails = () =>
  Alert.alert(
    'Insufficient Details',
    'Fill up all inputs with the red asterisk.',
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  );

export const alertDeleteListing = (onDelete: () => void) =>
  Alert.alert('Delete Listing', 'Do you want to delete your listing?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'destructive',
    },
    {
      text: 'Delete',
      onPress: onDelete,
      style: 'default',
    },
  ]);

export const alertEmergencyStop = (onStop: () => void) =>
  Alert.alert('Emergency Stop', 'Do you want to stop your ride?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'destructive',
    },
    {
      text: 'Stop',
      onPress: onStop,
      style: 'default',
    },
  ]);
