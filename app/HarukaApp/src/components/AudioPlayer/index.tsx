import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { IconButton, ProgressBar, Text } from 'react-native-paper';
import Sound from 'react-native-sound';

interface AudioPlayerProps {
  uri: string;
}

Sound.setCategory('Playback');

const AudioPlayer = (props: AudioPlayerProps) => {
  const { uri } = props;

  const [progressStr, setProgressStr] = useState('00:00 / 00:00');
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [resource, setResource] = useState<string>();

  const sound = useMemo(() => {
    if (uri && resource && uri === resource) {
      setProgress(0);
      return new Sound(resource, undefined, error => {
        if (error) {
          ToastAndroid.show('音频加载失败', ToastAndroid.SHORT);
        } else {
          setIsLoaded(true);
          ToastAndroid.show('音频加载成功', ToastAndroid.SHORT);
        }
      });
    }
  }, [resource, uri]);

  const calcProgress = useCallback(() => {
    if (sound) {
      sound.getCurrentTime(seconds => {
        setProgress(seconds / sound.getDuration());
        setProgressStr(
          `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0')} / ${Math.floor(sound.getDuration() / 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(sound.getDuration() % 60)
            .toString()
            .padStart(2, '0')}`,
        );
      });
    } else {
      setProgress(0);
      setProgressStr('00:00 / 00:00');
    }
  }, [sound]);

  const task = useMemo(() => {
    return setInterval(calcProgress, 1000);
  }, [calcProgress]);

  useEffect(() => {
    return () => {
      sound?.release();
      clearInterval(task);
    };
  }, [sound, task]);

  useEffect(() => {
    // 修改uri后自动重置状态
    if (uri !== resource) {
      setIsLoaded(false);
    }
  }, [resource, uri]);

  return (
    <View style={style.container}>
      <View>
        <ProgressBar
          progress={progress}
          style={style.processBar}
          color="black"
        />
      </View>

      <View style={style.subContainer}>
        <Text style={style.text}>{progressStr}</Text>
        {isLoaded ? (
          <IconButton
            mode="contained"
            style={style.icon}
            icon={!sound?.isPlaying() ? 'play' : 'pause'}
            onPress={() => {
              if (sound?.isPlaying()) {
                sound?.pause();
              } else {
                sound?.play();
              }
            }}
          />
        ) : (
          <IconButton
            mode="contained"
            style={style.icon}
            icon="download"
            onPress={() => {
              setResource(uri);
            }}
          />
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginVertical: 10,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  processBar: {
    flexShrink: 0,
    flexGrow: 1,
    // height: 30,
    width: 180,
    borderColor: 'black',
    borderWidth: 0.2,
  },
  text: {
    flexShrink: 1,
  },
  icon: {
    flexShrink: 1,
  },
});

export default AudioPlayer;
