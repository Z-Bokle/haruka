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

  console.log(progress);

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
      <View>
        <ProgressBar
          progress={progress}
          style={style.processBar}
          color="black"
        />
      </View>

      <View style={style.subContainer}>
        <Text style={style.text}>{progressStr}</Text>
        <IconButton
          mode="contained"
          style={style.icon}
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
