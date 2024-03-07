import React from 'react';
import { PaperProvider } from 'react-native-paper';
import Main from './src/Main';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Main />
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
