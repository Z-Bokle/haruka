import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import Video from 'react-native-video';

const Authorization = () => {
  const videoRef = useRef<Video>(null);
  const bgVideo = require('../../assets/videos/auth_bg.mp4');

  return (
    <View style={styles.constainer}>
      <View style={styles.buttonBlockContainer}>
        <Button style={styles.button} mode="elevated">
          登录
        </Button>

        <Button style={styles.button} mode="elevated">
          注册
        </Button>
      </View>
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
    height: 200,
    top: Dimensions.get('window').height / 1.5,
    zIndex: 100,
  },

  blurContainer: {
    width: '80%',
    height: 200,
    flex: 0,
    backgroundColor: 'aqua',
    zIndex: 99,
    top: Dimensions.get('window').height / 1.5 - 200,
  },

  button: {
    width: 200,
    height: 50,
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
