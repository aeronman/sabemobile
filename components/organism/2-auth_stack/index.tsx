import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import AuthSignUp from '../../molecules/auth-signup';
import AuthSignIn from '../../molecules/auth-signin';

function AuthStack({setProfile, setUserUID, setIsLoggedIn}: any) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignUp">
        {props => <AuthSignUp {...props} />}
      </Stack.Screen>
      <Stack.Screen name="SignIn">
        {props => (
          <AuthSignIn
            {...props}
            setProfile={setProfile}
            setUserUID={setUserUID}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default AuthStack;
