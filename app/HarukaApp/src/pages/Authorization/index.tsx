import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, ToastAndroid, View } from 'react-native';
import { Button } from 'react-native-paper';
import Video from 'react-native-video';
import AuthInput from '../../components/AuthInput';
import { deleteItem, getItem } from '../../utils/SecurityStoarge';
import { useGlobalStore } from '../../utils/AppStores';
import { useNetwork } from '../../utils/Network';
import { user } from '../../api';

const Authorization = ({ navigation }) => {
  // const videoRef = useRef<Video>(null);
  const bgVideo = require('../../assets/videos/auth_bg.mp4');

  const [status, setStatus] = useState<'none' | 'register' | 'login'>('none');

  const { setToken } = useGlobalStore(state => ({ setToken: state.setToken }));

  const { baseUrl } = useNetwork();

  useEffect(() => {
    // 从本地存储读出token，如果存在就直接跳转到主页 navigation.replace('App')
    // 如果存在，也顺便存进状态管理

    (async () => {
      try {
        const token = await getItem('token');
        if (token) {
          const res = await fetch(`${baseUrl}${user.info}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          }).then(resp => resp.json());
          if (res.errorCode === 0) {
            setToken(token);
            navigation.replace('App');
            ToastAndroid.show('自动登录成功', ToastAndroid.SHORT);
          } else {
            deleteItem('token');
          }
        } else {
          console.log('No token in local storage.');
        }
      } catch (e: any) {
        console.error(e.message);
      }
    })();
  }, [baseUrl, navigation, setToken]);

  return (
    <View style={styles.constainer}>
      {status === 'none' ? (
        <View style={styles.buttonBlockContainer}>
          <Button
            labelStyle={styles.buttonText}
            style={styles.button}
            mode="elevated"
            onPress={() => setStatus('login')}>
            登录
          </Button>

          <Button
            labelStyle={styles.buttonText}
            style={styles.button}
            mode="elevated"
            onPress={() => setStatus('register')}>
            注册
          </Button>
        </View>
      ) : status === 'register' ? (
        <AuthInput
          type="register"
          onCancel={() => setStatus('none')}
          onSuccess={() => setStatus('login')}
        />
      ) : (
        <AuthInput
          type="login"
          onCancel={() => setStatus('none')}
          onSuccess={() => {
            setStatus('none');
            navigation.replace('App');
          }}
        />
      )}
      <Video
        source={bgVideo}
        // ref={videoRef}
        style={styles.videoPlayer}
        resizeMode="stretch"
        repeat
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  constainer: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },

  buttonBlockContainer: {
    flex: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: 'auto',
    width: '80%',
    height: 160,
    top: Dimensions.get('window').height / 1.5,
    zIndex: 100,
  },

  button: {
    width: 200,
    flex: 0,
  },
  buttonText: {
    fontSize: 16,
  },

  videoPlayer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
export default Authorization;
