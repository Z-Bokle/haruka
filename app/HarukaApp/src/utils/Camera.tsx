import { useEffect } from 'react';
import { Linking, Platform, ToastAndroid } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

/** 预处理相机所需的权限 */
export const useHandleCameraPermission = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    (async () => {
      if (hasPermission) {
        return;
      } else {
        const result = await requestPermission();
        if (result) {
          return;
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.show('未开启相机权限', ToastAndroid.SHORT);
          } else {
            console.warn('未开启相机权限');
          }
          await Linking.openSettings();
        }
      }
    })();
  }, [hasPermission, requestPermission]);
};
