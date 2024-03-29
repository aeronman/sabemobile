import React, {useEffect} from 'react';

import MainStack from './components/organism/1-main_stack';

import notifee from '@notifee/react-native';

import {enableLatestRenderer} from 'react-native-maps';

function App(): React.JSX.Element {
  useEffect(() => {
    notifeeRequestPermission();
  }, []);

  enableLatestRenderer();

  async function notifeeRequestPermission() {
    await notifee.requestPermission();
  }

  return <MainStack />;
}

export default App;
