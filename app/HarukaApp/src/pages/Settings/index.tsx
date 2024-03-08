import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../../utils/StyleSheets';
import { useGlobalStore } from '../../utils/AppStores';

function Settings() {
  const { token, setToken } = useGlobalStore(state => ({
    token: state.token,
    setToken: state.setToken,
  }));

  return (
    <View style={styles.container}>
      <Text onPress={() => setToken('123456')}>{token ?? 11111}</Text>
    </View>
  );
}

export default Settings;
