import React, { useEffect, Suspense } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './app/providers/store';
import {
  navRef,
  isMountedRef,
} from './app/providers/services/NavigatorService';
import AppNavigator from './app/navigation/navigator';

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <SafeAreaProvider>
          <NavigationContainer ref={navRef}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Suspense>
    </Provider>
  );
};

export default App;
