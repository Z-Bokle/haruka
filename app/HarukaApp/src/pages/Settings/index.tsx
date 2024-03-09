import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';

import { useDialog, useGlobalStore } from '../../utils/AppStores';
import { useNetwork } from '../../utils/Network';
import { user } from '../../api';
import NetworkSettingModal from '../../components/NetworkSettingModal';
import { deleteItem } from '../../utils/SecurityStoarge';

function Settings({ navigation }) {
  const { setToken } = useGlobalStore(state => ({
    setToken: state.setToken,
  }));

  const { show } = useDialog();

  const [userName, setUserName] = useState('');
  const [showNetworkSettingModal, setShowNetworkSettingModal] = useState(false);

  const { jsonGet } = useNetwork();

  useEffect(() => {
    console.log('useEffect');
    jsonGet(user.info).then(result => {
      if (result.errorCode === 0 || !result.errorCode) {
        setUserName(result.data.userName);
      } else {
        throw new Error(result.errorMessage);
      }
    });
  }, [jsonGet]);

  return (
    <>
      <View style={style.container}>
        <View style={style.avatarConatiner}>
          <Avatar.Text size={96} label={userName.slice(0, 2)} />
          <Text variant="titleMedium" style={style.greeting}>
            你好，{userName}
          </Text>
        </View>
        <View style={style.menuContainer}>
          <Button onPress={() => setShowNetworkSettingModal(true)}>
            修改Base URL
          </Button>
          <Button
            onPress={() => {
              show({
                title: '请确认',
                content: '是否退出登录？',
                okCallback: () => {
                  setToken(null);
                  deleteItem('token');
                  navigation.replace('Authorization');
                },
              });
            }}>
            退出登录
          </Button>
        </View>
      </View>
      <NetworkSettingModal
        visible={showNetworkSettingModal}
        onClose={() => setShowNetworkSettingModal(false)}
      />
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF',
    paddingVertical: 72,
  },
  avatarConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {},
  greeting: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 18,
  },
});

export default Settings;
