import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { globalStyles } from '../../utils/StyleSheets';

function Home() {
  return (
    <View style={globalStyles.container}>
      <Text>Home</Text>
    </View>
  );
}

export default Home;
