import { BlurView } from '@react-native-community/blur';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput as NativeTextInput,
  View,
  ToastAndroid,
} from 'react-native';
import { Button, Icon, Text, TextInput } from 'react-native-paper';
import { useAuthorize } from '../../hooks/useAuthorize';
import { useDialog } from '../../utils/AppStores';
import NetworkSettingModal from '../NetworkSettingModal';

type Props = {
  type: 'register' | 'login';
  onSuccess?: () => void;
  onCancel?: () => void;
};

const authText = {
  register: {
    title: '注册',
  },
  login: {
    title: '登录',
  },
};

const AuthInput = (props: Props) => {
  const { type, onSuccess, onCancel } = props;

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [showNetworkSettingModal, setShowNetworkSettingModal] = useState(false);

  const userNameRef = useRef<NativeTextInput>(null);

  const { register, login } = useAuthorize();
  const { show } = useDialog();

  const doRegister = useCallback(() => {
    register(userName, password)
      .then(() => {
        ToastAndroid.show('注册成功', ToastAndroid.SHORT);
        onSuccess?.();
      })
      .catch(err => {
        show({ content: err.message });
      });
  }, [onSuccess, password, register, show, userName]);

  const doLogin = useCallback(() => {
    login(userName, password)
      .then(() => {
        ToastAndroid.show('登录成功', ToastAndroid.SHORT);
        onSuccess?.();
      })
      .catch(err => {
        show({ content: err.message });
      });
  }, [onSuccess, password, login, show, userName]);

  useEffect(() => {
    if (userNameRef.current) {
      userNameRef.current.focus();
    }
  }, []);

  return (
    <>
      <BlurView
        style={style.blurContainer}
        blurType="dark"
        blurAmount={25}
        blurRadius={12}
      />
      <View style={style.conatiner}>
        <View style={style.actionBar}>
          <Button
            compact
            mode="elevated"
            buttonColor="white"
            onPress={() => onCancel?.()}
            style={style.backButton}>
            <Icon source="arrow-left" size={24} />
          </Button>
          <Button
            compact
            mode="elevated"
            buttonColor="white"
            onPress={() => setShowNetworkSettingModal(true)}
            style={style.backButton}>
            <Icon source="cog" size={24} />
          </Button>
        </View>

        <View style={style.titleContainer}>
          <Text variant="titleLarge">{authText[type].title}</Text>
        </View>

        <TextInput
          style={style.input}
          mode="outlined"
          label="用户名"
          placeholder="请输入用户名"
          underlineColor="rgb(132, 132, 132)"
          activeUnderlineColor="rgb(132, 132, 132)"
          textColor="rgb(32, 32, 32)"
          ref={userNameRef}
          value={userName}
          onChangeText={text => setUserName(text)}
        />

        <TextInput
          style={style.input}
          mode="outlined"
          label="密码"
          placeholder="请输入密码"
          underlineColor="rgb(132, 132, 132)"
          activeUnderlineColor="rgb(132, 132, 132)"
          textColor="rgb(32, 32, 32)"
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <Button
          onPress={() => {
            type === 'register' ? doRegister() : doLogin();
          }}
          mode="elevated"
          buttonColor="white"
          textColor="rgb(32, 32, 32)"
          style={style.submitButton}>
          提交
        </Button>
      </View>
      <NetworkSettingModal
        visible={showNetworkSettingModal}
        onClose={() => setShowNetworkSettingModal(false)}
      />
    </>
  );
};

const style = StyleSheet.create({
  conatiner: {
    flex: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexBasis: 'auto',
    width: '80%',
    height: 400,
    top: 80,
    zIndex: 100,
    backgroundColor: 'white',
    // opacity: 0.9,
    borderRadius: 12,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    flex: 0,
    zIndex: 10,
    position: 'absolute',
    // top: 80,
  },
  titleContainer: { marginVertical: 16 },
  actionBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButton: {
    paddingHorizontal: 6,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginVertical: 8,
  },
  submitButton: {
    width: '100%',
    marginTop: 34,
  },
});

export default AuthInput;
