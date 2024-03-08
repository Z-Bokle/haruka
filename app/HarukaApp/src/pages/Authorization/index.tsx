import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Video from 'react-native-video';
import AuthInput from '../../components/AuthInput';

const Authorization = () => {
  const videoRef = useRef<Video>(null);
  const bgVideo = require('../../assets/videos/auth_bg.mp4');

  const [status, setStatus] = useState<'none' | 'register' | 'login'>('none');

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
          onSuccess={() => setStatus('none')}
        />
      ) : (
        <AuthInput type="login" onCancel={() => setStatus('none')} />
      )}
      <Video
        source={bgVideo}
        ref={videoRef}
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
