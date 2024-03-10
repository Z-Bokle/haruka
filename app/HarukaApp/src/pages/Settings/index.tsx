import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';

import { useDialog, useGlobalStore } from '../../utils/AppStores';
import { useNetwork } from '../../utils/Network';
import { user } from '../../api';
import NetworkSettingModal from '../../components/NetworkSettingModal';
import { deleteItem } from '../../utils/SecurityStoarge';
import { useNavigation } from '@react-navigation/native';

function Settings() {
  const { setToken } = useGlobalStore(state => ({
    setToken: state.setToken,
  }));

  const navigation: any = useNavigation();

  const { show } = useDialog();

  const [userName, setUserName] = useState('');
  const [showNetworkSettingModal, setShowNetworkSettingModal] = useState(false);

  const { jsonGet } = useNetwork();

  useEffect(() => {
    jsonGet(user.info).then(result => {
      setUserName(result.userName);
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
          <Button
            labelStyle={style.button}
            onPress={() => setShowNetworkSettingModal(true)}>
            修改Base URL
          </Button>
          <Button
            textColor="red"
            labelStyle={style.button}
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
    paddingTop: 72,
    paddingBottom: 32,
  },
  avatarConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: { rowGap: 24 },
  greeting: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 18,
  },
  button: {
    fontSize: 14,
  },
});

export default Settings;
