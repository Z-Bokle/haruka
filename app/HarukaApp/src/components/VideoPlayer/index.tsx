import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, ProgressBar, Text } from 'react-native-paper';
import Video, { VideoProperties } from 'react-native-video';

export interface VideoPlayerProps extends VideoProperties {}

const VideoPlayer = (props: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const progress = useMemo(() => {
    if (duration === 0) {
      return 0;
    } else {
      return currentTime / duration;
    }
  }, [currentTime, duration]);

  const progressStr = useMemo(
    () =>
      duration === 0
        ? '00:00 / 00:00'
        : `${Math.floor(currentTime / 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(currentTime % 60)
            .toString()
            .padStart(2, '0')} / ${Math.floor(duration / 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(duration % 60)
            .toString()
            .padStart(2, '0')}`,
    [currentTime, duration],
  );

  return (
    <View style={style.container}>
      <View style={style.videoContainer}>
        <Video
          {...props}
          resizeMode="contain"
          style={style.video}
          paused={!isPlaying}
          onLoad={result => {
            setCurrentTime(result.currentTime);
            setDuration(result.duration);
          }}
          onProgress={result => {
            setCurrentTime(result.currentTime);
            setDuration(result.seekableDuration);
          }}
        />
      </View>

      <View style={style.controlsConatiner}>
        <View>
          <ProgressBar
            progress={progress}
            style={style.progressBar}
            color="black"
          />
        </View>

        <View>
          <Text style={style.text}>{progressStr}</Text>
        </View>

        <IconButton
          style={style.icon}
          mode="contained"
          icon={isPlaying ? 'pause' : 'play'}
          onPress={() => setIsPlaying(!isPlaying)}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    flex: 1,
    rowGap: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: 200,
  },
  controlsConatiner: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  progressBar: {
    flexShrink: 0,
    flexGrow: 1,
    width: Dimensions.get('window').width / 2.8,
    borderColor: 'black',
    borderWidth: 0.2,
    borderRadius: 999,
  },
  text: {
    flexShrink: 1,
  },
  icon: {
    flexShrink: 1,
  },
});

export default VideoPlayer;
