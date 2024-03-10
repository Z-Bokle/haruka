import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  // const [isPlaying, setIsPlaying] = useState(false);

  const sound = useMemo(() => {
    setProgress(0);
    return new Sound(uri);
  }, [uri]);

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
      sound && sound.release();
      clearInterval(task);
    };
  }, [sound, task]);

  return (
    <View style={style.container}>
      <ProgressBar progress={progress} />
      <Text>{progressStr}</Text>
      <IconButton
        icon={!sound.isPlaying() ? 'play' : 'pause'}
        onPress={() => {
          if (sound.isPlaying()) {
            sound.pause(() => {
              // setIsPlaying(false);
            });
          } else {
            sound.play(success => {
              // console.log('ssss');
              // if (success) {
              //   console.log('success');
              //   setIsPlaying(true);
              // }
            });
          }
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default AudioPlayer;
