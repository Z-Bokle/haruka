import React, { useState } from 'react';
import { useGlobalStore } from '../../utils/AppStores';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

const NetworkSettingModal = (props: Props) => {
  const { visible = false, onClose } = props;

  const { baseUrl, setBaseUrl } = useGlobalStore(state => {
    return { baseUrl: state.baseUrl, setBaseUrl: state.setBaseUrl };
  });

  const [url, setUrl] = useState(baseUrl);

  console.log(url);

  return (
    <Portal>
      <View style={style.container}>
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={style.modalContainer}>
          <View style={style.titleContainer}>
            <Text variant="titleLarge">设置</Text>
          </View>
          <TextInput
            label="服务端的Base URL"
            mode="outlined"
            style={style.input}
            defaultValue={url}
            // value={url}
            onChangeText={setUrl}
          />
          <Button
            mode="elevated"
            buttonColor="white"
            textColor="rgb(32, 32, 32)"
            style={style.okButton}
            onPress={() => {
              setBaseUrl(url);
              onClose?.();
            }}>
            确定
          </Button>
        </Modal>
      </View>
    </Portal>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  modalContainer: {
    // marginLeft: 24,
    backgroundColor: 'white',
    // opacity: 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    width: '80%',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleContainer: { marginVertical: 16 },
  input: {
    width: '100%',
  },
  okButton: {
    marginTop: 16,
    marginBottom: 8,
  },
});

export default NetworkSettingModal;
