import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export const useVideoManager = () => {
  const [asset, setAsset] = useState<Asset>();

  const getVideoFromLocal = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      formatAsMp4: true,
    });
    if (result.didCancel) {
      ToastAndroid.show('已取消', ToastAndroid.SHORT);
    }
    if (result.errorMessage) {
      ToastAndroid.show(`选择失败-${result.errorMessage}`, ToastAndroid.SHORT);
    }
    if (result.assets) {
      const file = result.assets?.[0];
      if (file.fileSize && file.fileSize > 20 * 1024 * 1024) {
        ToastAndroid.show('视频大小不能超过20M', ToastAndroid.SHORT);
        return null;
      }
      setAsset(file);
      return file;
    }
  }, []);

  const getVideoByCamera = useCallback(async () => {
    const result = await launchCamera({
      mediaType: 'video',
      formatAsMp4: true,
      durationLimit: 30,
      cameraType: 'front',
    });
    if (result.didCancel) {
      ToastAndroid.show('已取消', ToastAndroid.SHORT);
    }
    if (result.errorMessage) {
      ToastAndroid.show(
        `视频录制失败-${result.errorMessage}`,
        ToastAndroid.SHORT,
      );
    }
    if (result.assets) {
      const file = result.assets?.[0];
      if (file.fileSize && file.fileSize > 20 * 1024 * 1024) {
        ToastAndroid.show('视频大小不能超过20M', ToastAndroid.SHORT);
        return null;
      }
      setAsset(file);
      return file;
    }
  }, []);

  return {
    getVideoFromLocal,
    getVideoByCamera,
    asset,
  };
};
